import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

// Prevent caching for all routes
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.get("/", (req, res) => {
  res.status(200).send({ message: "Hello from Groq CodeX!" });
});

app.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).send({ error: "Missing 'prompt' in request body" });
    }

    // ✅ Use Groq’s current active model
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // latest recommended replacement model
      messages: [{ role: "user", content: prompt }],
    });

    res.status(200).send({
      bot: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: error.message });
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
