import os
import pandas as pd
from flask import Flask, render_template, request, redirect, url_for
from markupsafe import Markup
import google.generativeai as genai
from io import StringIO

app = Flask(__name__)
app.secret_key = 'supersecretkey'

# Global variables to store data
chat_log = []
api_key = None
csv_data = None

def parse_text(text):
    """Parse the given text and convert markdown-like syntax to HTML."""
    lines = text.split('\n')
    formatted_lines = []
    for line in lines:
        if line.startswith('### '):
            formatted_lines.append(f'<h3>{line[4:]}</h3>')
        elif line.startswith('## '):
            formatted_lines.append(f'<h2>{line[3:]}</h2>')
        elif line.startswith('# '):
            formatted_lines.append(f'<h1>{line[2:]}</h1>')
        elif line.startswith('**'):
            formatted_lines.append(f'<strong>{line[2:-2]}</strong>')
        elif line.startswith('* '):
            formatted_lines.append(f'<li>{line[2:]}</li>')
        else:
            formatted_lines.append(f'<p>{line}</p>')
    return Markup(''.join(formatted_lines))

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    global api_key, chat_log, csv_data
    
    # Read API key
    api_key = request.form['api_key']
    
    # Read CSV file content directly from the request
    file = request.files['file']
    if file.filename == '':
        return 'No selected file'
    if file:
        content = file.read().decode('utf-8')
        df_csv = pd.read_csv(StringIO(content))
        csv_data = df_csv.to_string()

        # Configure Gemini API
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        chat = model.start_chat(history=[])

        # Initial prompt
        prompt = request.form['prompt']
        response = chat.send_message(prompt + "\nVoici les données du CSV:\n" + csv_data)

        # Store response in global chat log
        chat_log = [(prompt, parse_text(response.text))]
        
        return redirect(url_for('chat'))

@app.route('/chat', methods=['GET', 'POST'])
def chat():
    global chat_log, api_key, csv_data
    
    if request.method == 'POST':
        user_message = request.form['message']
        
        # Include the entire chat history in the new prompt
        full_prompt = "\n".join([f"You: {msg}\nData: {resp}" for msg, resp in chat_log])
        full_prompt += f"\nYou: {user_message}\nData:"
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        chat = model.start_chat(history=[])

        # Continue conversation with CSV data context
        response = chat.send_message(full_prompt + "\nVoici les données du CSV:\n" + csv_data)
        chat_log.append((user_message, parse_text(response.text)))
        
        if user_message.lower() == "exit":
            return redirect(url_for('home'))
        
    return render_template('chat.html', chat_log=chat_log)

if __name__ == '__main__':
    app.run(debug=True)
