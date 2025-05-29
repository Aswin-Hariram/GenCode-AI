import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()


llm=ChatGoogleGenerativeAI(model="gemini-2.0-flash")

prompt=PromptTemplate.from_template("What is the capital of {country}")

chain=prompt | llm
response = chain.invoke({"country":"India"})
print(response.content)
