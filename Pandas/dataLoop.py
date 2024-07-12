import pandas as pd
import os
import google.generativeai as genai
from tabulate import tabulate

# Read the CSV file into a pandas DataFrame
df_csv = pd.read_csv('Pandas/maison.csv')

# Display DataFrame using tabulate
print(tabulate(df_csv, headers='keys', tablefmt='psql'))

# Configure the Gemini API with your API key and model choice
genai.configure(api_key=os.environ['API_KEY'])
model = genai.GenerativeModel('gemini-1.5-flash')

# Start a new chat session with an empty history
chat = model.start_chat(history=[])

# Data
prompt = input("Bonjour, mon nom est Data, comment puis-je vous aider? ")
data = df_csv.to_string()

# Send data to API
response = chat.send_message(prompt + "Voici les données du CSV" + data)

# Print data
print("Data: ", response.text)

# Loop to continue the conversation
while True:
  # Get user input
  user_message = input("Utilisateur: ")

  # Send the user message and print the response
  response = chat.send_message(user_message)
  print("Data: ", response.text)

  # Check for exit command
  if user_message.lower() == "exit":
    break

print("Conversation terminée.")