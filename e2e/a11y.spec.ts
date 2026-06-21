import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Automated WCAG 2.1 AA gate. Runs the same axe-core ruleset the project mandates
// (wcag2a/2aa/21a/21aa → 0 violations) across every public route and through the Build
// Studio flow (radio step → select step → review). Keeps the accessibility bar enforced
// in CI so it never relies on a manual check.

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

async function expectNoViolations(page: Page, label: string) {
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const summary = violations.map((v) => `${v.id} (${v.nodes.length})`).join(", ");
  expect(violations, `${label} — axe violations: ${summary}`).toEqual([]);
}

const ROUTES = [
  "/",
  "/the-centaur",
  "/story",
  "/who-its-for",
  "/why-us",
  "/news",
  "/configure",
  "/privacy",
  "/staff/login",
  "/track/CEN-TEST",
];

for (const route of ROUTES) {
  test(`a11y: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    await expectNoViolations(page, route);
  });
}

test("a11y: build studio flow", async ({ page }) => {
  await page.goto("/build/CEN-TEST", { waitUntil: "networkidle" });
  await expectNoViolations(page, "studio — step 1 (radio)");

  // Satisfy the one required field, then move to the seat & fit step (which has selects).
  await page.getByText("For myself", { exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await expectNoViolations(page, "studio — seat & fit (select)");

  // Advance to the review step (extra clicks are no-ops once Continue is gone).
  for (let i = 0; i < 12; i++) {
    const cont = page.getByRole("button", { name: "Continue" });
    if (!(await cont.isVisible().catch(() => false))) break;
    await cont.click();
  }
  await expect(page.getByRole("button", { name: "Send my specification" })).toBeVisible();
  await expectNoViolations(page, "studio — review (summary + contact + consent)");
});
