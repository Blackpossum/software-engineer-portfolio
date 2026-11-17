// Smoke tests: every route renders without console errors, unknown routes 404, and the
// two flows that need JavaScript (mobile menu, page wipe) work.
import { expect, type Page, test } from "@playwright/test";

const ROUTES = [
  "/",
  "/work/rover",
  "/work/platform",
  "/work/ess",
  "/work/promptomat",
  "/work/parish",
];

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

for (const route of ROUTES) {
  test(`${route} returns 200 with no console errors`, async ({ page }) => {
    const errors = collectErrors(page);
    const response = await page.goto(route);
    await page.waitForLoadState("networkidle");

    expect(response?.status()).toBe(200);
    await expect(page.locator("main h1")).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("an unknown route returns 404", async ({ page }) => {
  const response = await page.goto("/work/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.locator("main h1")).toContainText("doesn't exist");
});

test("the mobile menu opens and closes", async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/");
  const toggle = page.locator(".nav-toggle");

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(".nav-menu")).toHaveClass(/is-open/);

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("a work card opens its case study", async ({ page }) => {
  await page.goto("/");
  await page.locator(".work-card[href='/work/promptomat']").click();
  await page.waitForURL("**/work/promptomat");
  await expect(page.locator(".case-hero h1")).toContainText("Promptomat");
});
