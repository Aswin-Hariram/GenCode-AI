import os
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key from environment variables
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

# Configure Gemini Flash model
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0.7,
    convert_system_message_to_human=True,
    google_api_key=GOOGLE_API_KEY
)