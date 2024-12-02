import requests
from bs4 import BeautifulSoup
import google.generativeai as genai

# Configure the Gemini API with your API key
gemini_api_key = 'votre_clé_api_ici'
genai.configure(api_key=gemini_api_key)

def scrape_and_generate(urls, prompt):
    # Define headers to mimic a real browser request
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
    }

    combined_text = ""
    
    # Loop through each URL provided
    for url in urls:
        try:
            # Attempt to fetch the webpage content
            response = requests.get(url.strip(), headers=headers, timeout=30)
            response.raise_for_status()  # Raise an exception for bad status codes
            
            if response.status_code == 200:  # If the request was successful
                # Parse the HTML content
                soup = BeautifulSoup(response.content, 'html.parser')
                # Extract all text from the webpage
                text = soup.get_text(separator="\n", strip=True)
                combined_text += f"\nContent from {url}:\n{text}\n"
            else:
                combined_text += f"\nFailed to retrieve {url}. Status code: {response.status_code}\n"
                
        except requests.exceptions.RequestException as e:
            # Handle any errors that occur during the request
            combined_text += f"\nError accessing {url}: {e}\n"
    
    # If we successfully gathered any content
    if combined_text:
        try:
            # Use Gemini AI to generate content based on the prompt and scraped text
            model = genai.GenerativeModel('gemini-1.5-pro')
            response = model.generate_content(prompt + combined_text)
            return response.text
        except Exception as e:
            print(f"Error with Gemini API: {str(e)}")
            return None
    return None

def save_to_pdf(content, filename, options=None):
    # Add your PDF saving logic here
    pass 