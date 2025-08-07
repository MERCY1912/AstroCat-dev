from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:5177/")

    # Wait for the header to be visible
    header = page.locator("header").first
    header.wait_for(state="visible")

    # Take a screenshot of the header
    header.screenshot(path="jules-scratch/verification/logo_verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
