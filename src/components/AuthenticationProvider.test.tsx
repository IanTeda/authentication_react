import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("user can login and logout", async ({ page }) => {
    // Go to the login page
    await page.goto("http://localhost:5173/login");

    // Fill in the email and password fields
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("password");

    // Click the login button
    await page.getByRole("button", { name: /login/i }).click();

    // Wait for the token or user info to appear (adjust selector as needed)
    await expect(page.getByText(/Token:/)).toContainText("mock-token");
    await expect(page.getByText(/User:/)).toContainText("test@example.com");

    // Click the logout button
    await page.getByRole("button", { name: /logout/i }).click();

    // Token and user info should be cleared
    await expect(page.getByText(/Token:/)).toHaveText("Token:");
    await expect(page.getByText(/User:/)).toHaveText("User:");
  });
});
