import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Shareable Gemini client initialization helper (lazy initialized inside endpoint to avoid startup crashes if key missing)
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY is not defined or contains placeholder content. Please add a valid key in the Settings > Secrets panel.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// AI Assistant endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, userProfile, currentScheme } = req.body;
    
    // Construct system instructions
    let contextStr = "You are 'Yojna Saathi', a compassionate, intelligent AI Assistant on the Indian Government Service Portal 'YojnaConnect'.\n";
    contextStr += "Your sole objective is to help citizens understand and enroll in welfare schemes, explain complex criteria in simple terms, translate jargon, and list required documents.\n";
    
    if (userProfile) {
      contextStr += `\nYou are talking to:
- Name: ${userProfile.name || 'Citizen'}
- Date of Birth: ${userProfile.dob || 'Unspecified'}
- Gender: ${userProfile.gender || 'Unspecified'}
- State/District: ${userProfile.state || 'Unspecified'} / ${userProfile.district || 'Unspecified'}
- Occupation: ${userProfile.occupation || 'Unspecified'}
- Monthly Income: ${userProfile.incomeRangeIndex !== undefined ? `index ${userProfile.incomeRangeIndex}` : 'Unspecified'}
`;
    }

    if (currentScheme) {
      contextStr += `\nThey are currently viewing specific details of Scheme:
- Title: ${currentScheme.title}
- Category: ${currentScheme.category}
- Benefits: ${JSON.stringify(currentScheme.benefitsList)}
- Eligibility Criteria Required: ${JSON.stringify(currentScheme.eligibilityCriteria)}
- Documents Needed: ${JSON.stringify(currentScheme.requiredDocuments)}
`;
    }

    contextStr += "\nGuidelines for response:\n";
    contextStr += "1. Keep responses clear, warm, conversational, and highly accessible.\n";
    contextStr += "2. Break down long explanations into short bullet points.\n";
    contextStr += "3. Support multiple languages if they ask, and address them with respect (e.g., call them 'Ji' or respect prefix 'Namaste').\n";
    contextStr += "4. If their profile matches, congratulate and encourage them to click 'Apply Now' on the screen.\n";
    contextStr += "5. If their profile does not match some criteria, explain gently how they can fulfill it or list alternative documents they can prepare.\n";

    // Reconstruct conversation structure for GenAI
    // The google-genai SDK sendMessage expects simple text messages, or we can use generateContent.
    // Let's use ai.models.generateContent to make it clean and simple.
    const ai = getGeminiClient();
    
    // Build context prompt sequence
    const contents: any[] = [];
    
    // Add history from client
    if (Array.isArray(messages)) {
      messages.forEach((msg: any) => {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }

    // Call Gemini 3.5 Flash directly
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents.length > 0 ? contents : [{ role: 'user', parts: [{ text: "Hello, introduced yourself and ask how you can help me." }] }],
      config: {
        systemInstruction: contextStr,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini server error:", error);
    res.status(500).json({ 
      error: error.message || "An unidentified backend error occurred while reaching Gemini API."
    });
  }
});

// Configure Vite middleware or serve static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // For Express 4 use '*'
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
