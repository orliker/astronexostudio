import { test, expect, Page, ConsoleMessage } from '@playwright/test';

const BASE = 'http://localhost:3000';

const collectConsole = (page: Page) => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const onMessage = (msg: ConsoleMessage) => {
    const type = msg.type();
    const text = msg.text();
    // Vite dev tooling sometimes logs HMR info; filter
    if (text.includes('[vite]') || text.includes('Download the React DevTools')) return;
    if (type === 'error') errors.push(text);
    if (type === 'warning') warnings.push(text);
  };
  page.on('console', onMessage);
  page.on('pageerror', err => errors.push(`pageerror: ${err.message}`));
  return { errors, warnings };
};

test.describe('AstroNexo Studio - premium audit', () => {
  test.setTimeout(60_000);

  test('homepage loads with no console errors and key sections render', async ({ page }) => {
    const { errors } = collectConsole(page);
    await page.goto(BASE, { waitUntil: 'networkidle' });

    await expect(page).toHaveTitle(/AstroNexo Studio/);
    await expect(page.locator('html')).toHaveAttribute('lang', /es|en|pt/);

    // Hero
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.getByRole('link', { name: /quiero mi demo|get my demo|quero a minha demo/i }).first()).toBeVisible();

    await page.screenshot({ path: 'e2e/screenshots/01-hero.png', fullPage: false });

    // Scroll through sections
    const sectionIds = ['#services', '#process', '#pricing', '#faq', '#contact'];
    for (const id of sectionIds) {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) el.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' });
      }, id);
      await page.waitForTimeout(700);
    }

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'e2e/screenshots/02-footer.png', fullPage: false });

    expect(errors, `Console errors detected:\n${errors.join('\n')}`).toEqual([]);
  });

  test('full-page screenshot for visual reference', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'e2e/screenshots/03-fullpage.png', fullPage: true });
  });

  test('mobile viewport renders without horizontal overflow', async ({ page }) => {
    const { errors } = collectConsole(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE, { waitUntil: 'networkidle' });

    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth - document.documentElement.clientWidth;
    });
    expect(overflow, 'No horizontal scrollbar should appear on mobile').toBeLessThanOrEqual(2);

    await page.screenshot({ path: 'e2e/screenshots/04-mobile-hero.png', fullPage: false });

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'e2e/screenshots/05-mobile-footer.png', fullPage: false });

    expect(errors).toEqual([]);
  });

  test('contact form validates and builds wa.me link', async ({ page, context }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.querySelector('#contact')?.scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(500);

    // Submit empty form -> validation errors
    const submitBtn = page.getByRole('button', { name: /enviar por whatsapp|send via whatsapp|enviar via whatsapp/i });
    await submitBtn.click();
    const nameError = page.getByText(/indícanos tu nombre|tell us your name|indica o teu nome/i);
    await expect(nameError).toBeVisible();

    // Fill form
    await page.fill('#contact-name', 'Playwright Tester');
    await page.fill('#contact-business', 'QA Studio');
    await page.fill('#contact-message', 'This is an automated visual audit run.');

    // Intercept window.open / navigation to whatsapp
    const popupPromise = context.waitForEvent('page', { timeout: 5000 }).catch(() => null);
    await submitBtn.click();
    const popup = await popupPromise;
    if (popup) {
      const url = popup.url();
      // WhatsApp redirects wa.me → api.whatsapp.com, both valid endpoints
      expect(url).toMatch(/(wa\.me|api\.whatsapp\.com).*351931056365/);
      expect(url).toMatch(/Playwright[%+]20Tester|Playwright\+Tester/);
      await popup.close();
    } else {
      await page.waitForURL(/(wa\.me|api\.whatsapp\.com).*351931056365/, { timeout: 5000 });
    }
  });

  test('portfolio section renders 6 demos and filters correctly', async ({ page }) => {
    const { errors } = collectConsole(page);
    await page.goto(BASE, { waitUntil: 'networkidle' });

    // Anchor exists in navbar
    const navPortfolioLink = page.locator('nav a[href="#portfolio"]').first();
    await expect(navPortfolioLink).toBeVisible();

    // Scroll to portfolio
    await page.evaluate(() => document.querySelector('#portfolio')?.scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(700);

    // 6 cards rendered initially (filter "All")
    const cards = page.locator('#portfolio article');
    await expect(cards).toHaveCount(6);

    // Each card has working external link with target=_blank, rel=noopener noreferrer
    const externalLinks = page.locator('#portfolio article a[target="_blank"]');
    await expect(externalLinks).toHaveCount(6);
    for (let i = 0; i < 6; i++) {
      const link = externalLinks.nth(i);
      await expect(link).toHaveAttribute('rel', /noopener.*noreferrer|noreferrer.*noopener/);
      const href = await link.getAttribute('href');
      expect(href, 'demo URL must be a vercel app').toMatch(/^https:\/\/.+\.vercel\.app\/?$/);
      // Make sure KURB NU is NOT included
      expect(href).not.toMatch(/kurb-nu/);
    }

    // Click "Tattoo" filter and verify only 1 card remains
    const tattooFilter = page.locator('#portfolio button[role="tab"]').filter({ hasText: /tattoo/i }).first();
    await tattooFilter.click();
    await page.waitForTimeout(700);
    await expect(cards).toHaveCount(1);

    // Reset to All
    const allFilter = page.locator('#portfolio button[role="tab"]').first();
    await allFilter.click();
    await page.waitForTimeout(700);
    await expect(cards).toHaveCount(6);

    // CTA "I want something like this" links to #contact
    const wantSimilar = page.locator('#portfolio article a[href="#contact"]').first();
    await expect(wantSimilar).toBeVisible();

    await page.screenshot({ path: 'e2e/screenshots/06-portfolio.png', fullPage: false });

    expect(errors).toEqual([]);
  });

  test('portfolio mobile: no horizontal overflow, filters scroll horizontally', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE, { waitUntil: 'networkidle' });

    // Ensure layout settled: trigger ScrollTrigger refresh and wait for cards to mount
    await page.waitForSelector('#portfolio article', { state: 'attached' });
    await page.evaluate(() => {
      const el = document.querySelector('#portfolio') as HTMLElement | null;
      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'instant' as ScrollBehavior });
    });
    // Cards animate in with stagger ~ 0.6s; give them time
    await page.waitForTimeout(1500);
    await page.locator('#portfolio article').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth - document.documentElement.clientWidth;
    });
    expect(overflow, 'No global horizontal overflow on portfolio mobile').toBeLessThanOrEqual(2);

    await page.screenshot({ path: 'e2e/screenshots/07-portfolio-mobile.png', fullPage: false });

    // Filters card visible
    await page.locator('#portfolio button[role="tab"]').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'e2e/screenshots/08-portfolio-mobile-filters.png', fullPage: false });
  });

  test('language switcher updates html lang and persists', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    const enBtn = page.locator('button[aria-label="Switch to EN"]').first();
    await enBtn.click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});
