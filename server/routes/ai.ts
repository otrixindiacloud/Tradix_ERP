import type { Express } from "express";
import { generateAIResponse, getContextualSuggestions } from "../ai-service";

export function registerAIRoutes(app: Express) {
  // AI Assistant routes
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, context, pageContext } = req.body;
      
      // Create a comprehensive response based on the message
      const response = await generateAIResponse(message, context, pageContext);
      
      res.json(response);
    } catch (error) {
      console.error("Error in AI chat:", error);
      res.status(500).json({ 
        error: "Failed to process AI request",
        response: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        suggestions: ["Try asking a different question", "Check your connection", "Contact support"]
      });
    }
  });

  app.get("/api/ai/suggestions", async (req, res) => {
    try {
      const { page } = req.query;
      const suggestions = getContextualSuggestions(page as string);
      res.json(suggestions);
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      res.status(500).json([]);
    }
  });
}
