import "dotenv/config";
import express from "express";
import OpenAI from "openai";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY belum diatur.");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "20kb" }));
app.use(express.static("public"));

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 15,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Terlalu banyak pesan. Coba lagi sebentar." }
});

app.post("/api/chat", chatLimiter, async (req, res) => {
  try {
    const messages = req.body?.messages;

    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
      return res.status(400).json({ error: "Riwayat chat tidak valid." });
    }

    const safeMessages = messages.map((item) => {
      if (
        !item ||
        !["user", "assistant"].includes(item.role) ||
        typeof item.content !== "string" ||
        item.content.length > 4000
      ) {
        throw new Error("Format pesan tidak valid.");
      }
      return { role: item.role, content: item.content };
    });

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions:
        "Kamu adalah SAIRL AI, asisten digital yang ramah, jelas, aman, dan membantu. Jawab dalam bahasa yang digunakan pengguna. Jika tidak tahu, katakan dengan jujur.",
      input: safeMessages,
      max_output_tokens: 700
    });

    res.json({ reply: response.output_text || "Maaf, belum ada jawaban. Coba lagi." });
  } catch (error) {
    console.error("Chat API error:", error.message);
    const status = error.status && error.status >= 400 && error.status < 600 ? error.status : 500;
    res.status(status === 429 ? 429 : 500).json({
      error: status === 429
        ? "Layanan sedang sibuk atau batas penggunaan tercapai. Coba lagi nanti."
        : "SAIRL AI sedang mengalami kendala. Coba lagi beberapa saat."
    });
  }
});

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`SAIRL AI berjalan di port ${PORT}`);
});
