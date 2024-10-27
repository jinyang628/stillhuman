import time

from bs4 import BeautifulSoup
from playwright.async_api import async_playwright

from app.models.generate import GenerateResponse
from app.models.message import Message

class MessageService:
    async def generate(self, url: str) -> GenerateResponse:
        atree: dict = await extract_atree(url)
        processed_content: str = process_atree(atree)
        with open("atree.html", "w") as f:
            f.write(processed_content)
        print(processed_content)


def process_atree(atree: dict) -> list[Message]:
    print(atree.get("children"))

async def extract_atree(url: str) -> dict:
    # We are using this chrome extension to extract the claude chat log
    # https://chromewebstore.google.com/detail/ai-archives-share-claude/jagobfpimhagccjbkchfdilhejgfggna?hl=en
    if not url.startswith("https://aiarchives.org/id/"):
        raise ValueError("Invalid URL. Please use the URL from the extension.")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        await page.goto(url)
        time.sleep(5)  # Wait for page ready is not reliable
        atree = await page.accessibility.snapshot() or {}
        await browser.close()
        return atree
