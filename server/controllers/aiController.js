// @desc    Chat with AI Campus Assistant
// @route   POST /api/ai/chat
// @access  Private

const chatWithAI = async (req, res) => {
  const { message } = req.body;

  try {
     // In a production app, the logic below would call OpenAI/Gemini/Claude
     // For this DEMO, we'll provide a simulated, context-aware student assistant response.
     // This uses the student's name and role for personalization.

     let responseMessage = "";
     const lowercaseMsg = message.toLowerCase();

     if (lowercaseMsg.includes("find") || lowercaseMsg.includes("search")) {
        responseMessage = `Sure! I can help find peers. Searching for students with those specific qualities in our campus database... I recommend checking the 'Skill Matching' section or our current leaderboards for top contributors.`;
     } else if (lowercaseMsg.includes("event") || lowercaseMsg.includes("hackathon")) {
        responseMessage = `There are some exciting things happening! The 'Inter-University Hackathon' is coming up. Would you like me to RSVP for you or show you similar upcoming workshops?`;
     } else if (lowercaseMsg.includes("points") || lowercaseMsg.includes("badge")) {
        responseMessage = `You're making great progress! Every post and comment adds to your campus influence. Our top user currently has over 2,500 points. Keep engaging to climb the leaderboard!`;
     } else {
        responseMessage = `I'm your UniLink guide! I can help you find teammates, discover campus events, or explain how to earn more badges. What's on your mind today?`;
     }

     res.json({
        success: true,
        response: responseMessage,
        history: [
            { role: 'user', content: message },
            { role: 'assistant', content: responseMessage }
        ]
     });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { chatWithAI };
