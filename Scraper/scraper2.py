import requests
from bs4 import BeautifulSoup

# Get informations from user
url = input("URL: ")

# Send a GET request to the website
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:

    print("Response Content:")
    print(response.content)
    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Extract all text content from the page
    all_text = soup.get_text(separator="\n", strip=True)
    print("Soup Content:")
    print(all_text)
    
    # Save the generated content to a file
    # with open('generated_content.txt', 'w', encoding='utf-8') as file:
        # file.write(generated_text)
else:
    print(f"Failed to retrieve the web page. Status code: {response.status_code}")
