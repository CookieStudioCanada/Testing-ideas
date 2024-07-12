import os
import google.generativeai as genai

# Configure the Gemini API with your API key and chose model
genai.configure(api_key=os.environ['API_KEY'])
model = genai.GenerativeModel('gemini-1.5-flash')

# Start a new chat session
chat = model.start_chat(history=[])

prompt = input("Bonjour, mon nom est Gina, comment puis-je vous aider? ")

response = chat.send_message(prompt)

print("Gina: ", response.text)

# Loop to continue the conversation
while True:
  # Get user input
  user_message = input("Utilisateur: ")

  # Send the user message and print the response
  response = chat.send_message(user_message)
  print("Gina: ", response.text)

  # Check for exit command
  if user_message.lower() == "exit":
    break

print("Conversation ended.")