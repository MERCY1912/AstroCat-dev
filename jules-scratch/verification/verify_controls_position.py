from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Set viewport to a desktop size
    page.set_viewport_size({"width": 1280, "height": 720})

    page.goto("http://localhost:5182/")

    # Wait for the header to be visible
    header = page.locator("header").first
    header.wait_for(state="visible")

    # Take a screenshot of the header on desktop
    header.screenshot(path="jules-scratch/verification/controls_position_desktop.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
