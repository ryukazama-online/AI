import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const GEMINI_API_KEY = "AIzaSyD4VyKtqhs65MVOlf3P_ybkkrIPzaCDOIs";
  const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  const message = req.body.message.toLowerCase().trim();

  const predefinedResponses = {
    "siapa kamu": "Halo! Saya adalah Chatbox, chatbot AI cerdas buatan Pio Keenan Bodhidharma. Saya dirancang untuk membantu Anda dalam berbagai bidang, mulai dari pemrograman hingga matematika dan pengetahuan umum. Jangan ragu untuk bertanya!",
    "kamu siapa": "Halo! Saya Chatbox, asisten virtual yang dibuat oleh Pio Keenan Bodhidharma. Saya bisa bantu kamu cari jawaban, buat kode, dan banyak lagi!",
    "who are you": "Hi! I'm Chatbox, a smart AI chatbot created by Pio Keenan Bodhidharma. Ask me anything!",
    "what is your name": "My name is Chatbox, your AI assistant built by Pio Keenan Bodhidharma."
  };

  if (predefinedResponses[message]) {
    return res.status(200).json({ reply: predefinedResponses[message] });
  }

  try {
    const response = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: req.body.message }],
          },
        ],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Gagal mendapatkan jawaban.";
    res.status(200).json({ reply });
  } catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Server error." });
  }
}
