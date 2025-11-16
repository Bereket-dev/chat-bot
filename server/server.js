const generateResponse = require("./utils/generateResponse");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
app.post("/generate-response", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages)
      return res.status(400).json({ error: "No message provided" });

    const aiResponse = await generateResponse(messages);

    res.json({ response: aiResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI generation failed" });
  }
});
