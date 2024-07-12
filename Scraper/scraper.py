import requests
from bs4 import BeautifulSoup
import os
import google.generativeai as genai

# Configure the Gemini API with your API key
gemini_api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=gemini_api_key)

# Get the URL and prompt from the user
url = input("URL: ")
prompt = input("Prompt: ")

# Send a GET request to the website
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Extract all text content from the page
    all_text = soup.get_text(separator="\n", strip=True)
    
    # Use the Gemini API to generate content based on the full text
    model = genai.GenerativeModel('gemini-1.5-pro')
    response = model.generate_content(prompt + all_text)
    generated_text = response.text
    print("Generated Content:")
    print(generated_text)
    
    # Save the generated content to a file
    with open('generated_content.txt', 'w', encoding='utf-8') as file:
        file.write(generated_text)
else:
    print(f"Failed to retrieve the web page. Status code: {response.status_code}")
