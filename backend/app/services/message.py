import time

from bs4 import BeautifulSoup
from playwright.async_api import async_playwright

from app.models.generate import GenerateResponse


class MessageService:
    async def generate(self, url: str) -> GenerateResponse:
        html: str = await extract_html(url)
        processed_content: str = process_html(html)
        with open("atree.html", "w") as f:
            f.write(processed_content)
        print(processed_content)


def process_html(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")
    submit_box = soup.find("div", class_="submit-box")
    return str(submit_box) if submit_box else ""


async def extract_html(url: str) -> str:
    # We are using this chrome extension to extract the claude chat log
    # https://chromewebstore.google.com/detail/ai-archives-share-claude/jagobfpimhagccjbkchfdilhejgfggna?hl=en
    if not url.startswith("https://aiarchives.org/id/"):
        raise ValueError("Invalid URL. Please use the URL from the extension.")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        await page.goto(url)
        time.sleep(5)  # Wait for page ready is not reliable
        html_content = await page.content()
        await browser.close()
        return html_content
