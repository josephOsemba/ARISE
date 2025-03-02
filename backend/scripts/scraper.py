import sys
import json
import requests
from bs4 import BeautifulSoup

def scrape_website(url):
    """Scrapes the webpage and extracts text content and images."""
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            return json.dumps({"error": "Failed to retrieve content"})

        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract text
        text_content = [p.text.strip() for p in soup.find_all('p') if p.text.strip()]

        # Extract images
        images = [img['src'] for img in soup.find_all('img') if 'src' in img.attrs]

        # Return JSON response
        return json.dumps({"text": text_content, "images": images})

    except Exception as e:
        return json.dumps({"error": str(e)})

if __name__ == "__main__":
    url = sys.argv[1]  # Get URL from command-line argument
    print(scrape_website(url))  # Print result for Node.js to read
