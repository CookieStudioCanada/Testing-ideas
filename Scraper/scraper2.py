import requests
from bs4 import BeautifulSoup
import os
from urllib.parse import urlparse
import time

# Get informations from user
url = input("URL: ")

def validate_url(url):
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except:
        return False

def scrape_website(url, output_dir="scraped_content"):
    # Validate URL
    if not validate_url(url):
        print("Invalid URL format. Please include http:// or https://")
        return

    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    try:
        # Add headers to mimic a browser request
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        print(f"Fetching content from {url}...")
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # Raise exception for bad status codes

        # Parse the HTML content
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove script and style elements
        for element in soup(['script', 'style']):
            element.decompose()

        # Extract useful content
        content = {
            'title': soup.title.string if soup.title else 'No title',
            'text': soup.get_text(separator="\n", strip=True),
            'links': [a.get('href') for a in soup.find_all('a', href=True)],
            'images': [img.get('src') for img in soup.find_all('img', src=True)]
        }

        # Generate filename from URL
        filename = os.path.join(output_dir, urlparse(url).netloc + '.txt')
        
        # Save the content
        with open(filename, 'w', encoding='utf-8') as file:
            file.write(f"Title: {content['title']}\n\n")
            file.write("Content:\n")
            file.write(content['text'])
            file.write("\n\nLinks found:\n")
            file.write('\n'.join(content['links']))
            file.write("\n\nImages found:\n")
            file.write('\n'.join(content['images']))

        print(f"\nContent successfully saved to {filename}")
        return content

    except requests.RequestException as e:
        print(f"Error fetching the webpage: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    while True:
        url = input("Enter URL to scrape (or 'quit' to exit): ").strip()
        
        if url.lower() == 'quit':
            break
            
        scrape_website(url)
        print("\n" + "="*50 + "\n")
