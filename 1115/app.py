import google.generativeai as genai

# Configure the Gemini API with your API key
genai.configure(api_key='AIzaSyAJch8mlPK70FNHiRFTBf2gkeOu4EC4tLI')

def get_gemini_response(prompt):
    # Initialize the model (using Gemini Pro instead of Flash for better compatibility)
    model = genai.GenerativeModel("gemini-pro")
    
    # Generate the response
    response = model.generate_content(prompt)
    
    return response.text

def main():
    print("Gemini AI Chat (type 'quit' to exit)")
    print("-" * 50)
    
    while True:
        user_input = input("\nYou: ")
        
        if user_input.lower() == 'quit':
            break
            
        try:
            response = get_gemini_response(user_input)
            print("\nGemini:", response)
        except Exception as e:
            print(f"\nError: {str(e)}")

if __name__ == "__main__":
    main()
