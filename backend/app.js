require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// Import scraping routes
const scrapeRoutes = require('./routes/scrapeRoutes'); 
app.use('/api', scrapeRoutes); // Prefix scrape routes with "/api"

// OpenAI API setup
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/ai-guide', async (req, res) => {
    try {
        const { prompt } = req.body;
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "system", content: "You are a virtual lab assistant." }, { role: "user", content: prompt }],
        });
        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        console.error("OpenAI Error:", error);
        res.status(500).json({ error: "AI Assistant is currently unavailable." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
