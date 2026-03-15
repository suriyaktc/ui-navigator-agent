import vertexai
from vertexai.generative_models import GenerativeModel

vertexai.init(project="nixoraa", location="us-central1")
model = GenerativeModel("gemini-1.5-pro")

response = model.generate_content("Navigate to the settings page")
print(response.text)
