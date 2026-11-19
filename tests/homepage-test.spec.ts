import test, { expect } from "@playwright/test";
import { HomePage } from "../pages/home.page";

test('Logo and sign in should be visible', async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.goto();
  await expect(homePage.logo).toBeVisible();
  await expect(homePage.signInButton).toBeVisible();
});
