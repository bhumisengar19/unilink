const { GoogleGenerativeAI } = require("@google/generative-ai");

// @desc    Chat with UniLink AI Assistant
// @route   POST /api/ai/chat
// @access  Private
const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: "Please provide a message" });
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Provide context about the user's profile and the platform
    const systemPrompt = `
      You are the official UniLink Campus AI Assistant. Your name is UniBot.
      You help university students connect, find events, team up for projects, and navigate their careers.
      The user chatting with you is called ${req.user.name}. 
      They are a ${req.user.role} and their current skills include: ${req.user.profile.skills?.join(", ") || 'none listed'}.
      
      Keep your answers short, friendly, concise, and highly relevant to a university campus setting. 
      Use emojis to be engaging!
      
      User's query: ${message}
    `;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();

    res.status(200).json({ reply: responseText });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: "AI Assistant is currently unavailable." });
  }
};

module.exports = { chatWithAI };
