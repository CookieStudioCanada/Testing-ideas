# Import necessary libraries
import requests  # For making HTTP requests to websites
from bs4 import BeautifulSoup  # For parsing HTML content
import os
import google.generativeai as genai  # Google's Gemini AI API
from datetime import datetime
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from textwrap import wrap
import tkinter as tk
from tkinter import scrolledtext, messagebox
from threading import Thread

# Configure the Gemini API with your API key
gemini_api_key = 'AIzaSyAJch8mlPK70FNHiRFTBf2gkeOu4EC4tLI'
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
        # Use Gemini AI to generate content based on the prompt and scraped text
        model = genai.GenerativeModel('gemini-1.5-pro')
        response = model.generate_content(prompt + combined_text)
        return response.text
    return "No content could be retrieved from any of the provided URLs."

def save_to_reading_list(urls, prompt, content):
    # Get current timestamp
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    # Save all information to a text file
    with open('reading_list.txt', 'a', encoding='utf-8') as file:
        file.write(f"\n{'='*50}\n")
        file.write(f"Date: {timestamp}\n")
        file.write("URLs:\n")
        for url in urls:
            file.write(f"- {url}\n")
        file.write(f"Prompt: {prompt}\n")
        file.write(f"Content:\n{content}\n")

def save_to_pdf(urls, prompt, content, filename=None):
    # Generate filename with timestamp if none provided
    if filename is None:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"report_{timestamp}.pdf"
    
    # Create PDF
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter  # Get page dimensions
    
    # Set initial y position from top of page
    y = height - 40
    
    # Add title
    c.setFont("Helvetica-Bold", 16)
    c.drawString(40, y, "Web Scraper Report")
    
    # Add timestamp
    y -= 30
    c.setFont("Helvetica", 12)
    c.drawString(40, y, f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Add URLs
    y -= 30
    c.drawString(40, y, "URLs:")
    for url in urls:
        y -= 20
        # Wrap long URLs
        for line in wrap(url, 80):
            c.drawString(60, y, f"• {line}")
            y -= 20
    
    # Add prompt
    y -= 20
    c.drawString(40, y, "Prompt:")
    y -= 20
    for line in wrap(prompt, 80):
        c.drawString(60, y, line)
        y -= 20
    
    # Add content
    y -= 20
    c.drawString(40, y, "Generated Content:")
    y -= 20
    
    # Split content into lines and handle page breaks
    for line in wrap(content, 80):
        if y < 40:  # If near bottom of page, start new page
            c.showPage()
            y = height - 40
            c.setFont("Helvetica", 12)
        c.drawString(60, y, line)
        y -= 20
    
    c.save()
    return filename

class ScraperGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Web Scraper and Content Generator")
        self.root.geometry("800x600")

        # URL Entry
        tk.Label(root, text="Enter URLs (separate with commas):", font=("Arial", 10)).pack(pady=5)
        self.url_entry = scrolledtext.ScrolledText(root, height=3)
        self.url_entry.pack(padx=10, pady=5)

        # Prompt Entry
        tk.Label(root, text="Enter your prompt:", font=("Arial", 10)).pack(pady=5)
        self.prompt_entry = scrolledtext.ScrolledText(root, height=3)
        self.prompt_entry.pack(padx=10, pady=5)

        # Results Area
        tk.Label(root, text="Generated Content:", font=("Arial", 10)).pack(pady=5)
        self.result_text = scrolledtext.ScrolledText(root, height=15)
        self.result_text.pack(padx=10, pady=5)

        # Buttons
        self.scrape_button = tk.Button(root, text="Scrape and Generate", command=self.start_scraping)
        self.scrape_button.pack(pady=10)

    def start_scraping(self):
        # Disable button while processing
        self.scrape_button.config(state='disabled')
        self.result_text.delete(1.0, tk.END)
        self.result_text.insert(tk.END, "Processing... Please wait...\n")
        
        # Run scraping in a separate thread to prevent GUI freezing
        Thread(target=self.scrape_process).start()

    def scrape_process(self):
        try:
            urls = [url.strip() for url in self.url_entry.get(1.0, tk.END).split(',')]
            prompt = self.prompt_entry.get(1.0, tk.END).strip()

            generated_content = scrape_and_generate(urls, prompt)
            
            # Update GUI with results
            self.result_text.delete(1.0, tk.END)
            self.result_text.insert(tk.END, generated_content)

            # Save results
            save_to_reading_list(urls, prompt, generated_content)
            pdf_file = save_to_pdf(urls, prompt, generated_content)
            
            messagebox.showinfo("Success", f"Content saved to reading_list.txt and {pdf_file}")
        except Exception as e:
            messagebox.showerror("Error", str(e))
        finally:
            # Re-enable button
            self.scrape_button.config(state='normal')

def main():
    root = tk.Tk()
    app = ScraperGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()
