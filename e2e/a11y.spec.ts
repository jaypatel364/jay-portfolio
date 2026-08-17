import { test, expect } from "@playwright/test";

test("homepage has an h1 and skip link", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeAttached();
});
