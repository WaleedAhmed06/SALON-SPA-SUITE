const { chromium } = require("@playwright/test");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.SALON_CHROMIUM_PATH
      ? { executablePath: process.env.SALON_CHROMIUM_PATH }
      : {}),
  });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(process.env.SALON_BASE_URL || "http://127.0.0.1:3000");
  await page.getByRole("button", { name: "Sign in to workspace" }).click();
  await page.getByRole("heading", { name: "Business overview" }).waitFor();
  await page.getByLabel("Switch demo role").selectOption("customer");
  await page
    .getByRole("heading", { name: "Your moments of well-being" })
    .waitFor();
  await page.reload();
  await page
    .getByRole("heading", { name: "Your moments of well-being" })
    .waitFor();
  await page.getByLabel("Toggle theme").click();
  if ((await page.locator(".shell[data-theme=light]").count()) !== 1)
    throw Error("Theme failed");
  await page.getByLabel("Switch demo role").selectOption("staff");
  await page.getByRole("heading", { name: "Your day, at a glance" }).waitFor();
  await page.getByLabel("Switch demo role").selectOption("receptionist");
  await page.getByRole("heading", { name: "Business overview" }).waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByLabel("Toggle navigation").click();
  await page.getByRole("button", { name: "Sign out" }).click();
  await page
    .getByRole("heading", { name: "Your day, beautifully organized." })
    .waitFor();
  if (errors.length) throw Error(errors.join("\n"));
  console.log(
    "PASS: login, four roles, persistence, theme, mobile navigation, logout; no page errors",
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
