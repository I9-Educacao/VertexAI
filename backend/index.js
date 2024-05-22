const express = require('express');
const { VertexAI } = require('@google-cloud/vertexai');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to process JSON data
app.use(express.json());

// Vertex AI configuration (replace with your project details)
const project = 'vertex-ai-gemini-423913'; // Your GCP project ID
const location = 'us-central1'; // Your Vertex AI project location
const model = 'gemini-1.5-pro-preview-0514'; // Your language model ID

// Initialize Vertex AI client
const vertexAI = new VertexAI({ project, location });
const generativeModel = vertexAI.preview.getGenerativeModel({
  model,
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 1,
    topP: 0.95,
  },
  safetySettings: [
    // Add your safety settings here
  ],
  systemInstruction: {
    parts: [
      {
        text: '',
      },
    ],
  },
});

// Function to generate response from the AI
async function generateAIResponse(message) {
  const req = {
    contents: [
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ],
  };

  const streamingResp = await generativeModel.generateContentStream(req);
  let generatedText = '';

  for await (const item of streamingResp.stream) {
    if (item.candidates && item.candidates[0].content && item.candidates[0].content.parts) {
      generatedText += item.candidates[0].content.parts[0].text;
    }
  }

  return generatedText;
}

// Route to handle incoming messages from the frontend
app.post('/api/send-message', cors(), async (req, res) => {
  const userMessage = req.body.text;
  const aiResponse = await generateAIResponse(userMessage);

  // Optional error handling (improve based on your needs)
  if (aiResponse.includes('ERROR')) {
    console.error('Error in AI response:', aiResponse);
    aiResponse = 'An error occurred. Please try again later.';
  }

  res.json({ text: aiResponse });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});