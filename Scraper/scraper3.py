import requests
from bs4 import BeautifulSoup
import os
import google.generativeai as genai
from datetime import datetime

# Configure the Gemini API
gemini_api_key = 'AIzaSyAJch8mlPK70FNHiRFTBf2gkeOu4EC4tLI'
genai.configure(api_key=gemini_api_key)

def scrape_and_generate(urls, prompt):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
    }

    combined_text = ""
    
    for url in urls:
        try:
            response = requests.get(url.strip(), headers=headers, timeout=30)
            response.raise_for_status()
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                text = soup.get_text(separator="\n", strip=True)
                combined_text += f"\nContent from {url}:\n{text}\n"
            else:
                combined_text += f"\nFailed to retrieve {url}. Status code: {response.status_code}\n"
                
        except requests.exceptions.RequestException as e:
            combined_text += f"\nError accessing {url}: {e}\n"
    
    if combined_text:
        model = genai.GenerativeModel('gemini-1.5-pro')
        response = model.generate_content(prompt + combined_text)
        return response.text
    return "No content could be retrieved from any of the provided URLs."

def save_to_reading_list(urls, prompt, content):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open('reading_list.txt', 'a', encoding='utf-8') as file:
        file.write(f"\n{'='*50}\n")
        file.write(f"Date: {timestamp}\n")
        file.write("URLs:\n")
        for url in urls:
            file.write(f"- {url}\n")
        file.write(f"Prompt: {prompt}\n")
        file.write(f"Content:\n{content}\n")

def main():
    print("Welcome to the Web Scraper and Content Generator!")
    print("Enter 'quit' to exit the program.")
    print("For multiple URLs, separate them with commas.")
    
    while True:
        url_input = input("\nEnter URL(s): ").strip()
        if url_input.lower() == 'quit':
            break
            
        # Split URLs and clean them
        urls = [url.strip() for url in url_input.split(',')]
        
        prompt = input("Enter your prompt: ").strip()
        
        print("\nProcessing multiple URLs... Please wait...")
        generated_content = scrape_and_generate(urls, prompt)
        
        print("\nGenerated Content:")
        print(generated_content)
        
        save_to_reading_list(urls, prompt, generated_content)
        print("\nContent has been saved to reading_list.txt")

if __name__ == "__main__":
    main()
