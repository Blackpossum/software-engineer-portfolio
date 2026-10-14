// Smoke test (F-01, AC4 and AC5): the home page loads with a 200 and no console errors.
import { expect, test } from "@playwright/test";

test("home page returns 200 with no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));

  const response = await page.goto("/");
  await page.waitForLoadState("networkidle");

  expect(response?.status()).toBe(200);
  await expect(page.locator("main")).toBeVisible();
  expect(errors).toEqual([]);
});
