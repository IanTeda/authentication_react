import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  reporter: 'list',
  use: {
    // Configure the chosen testing framework settings here
    // Example for Jest:
    // testFramework: 'jest',
  },
});