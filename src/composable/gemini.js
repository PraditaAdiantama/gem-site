import { GoogleGenerativeAI } from "@google/generative-ai";

function Gemini() {
  const genAI = new GoogleGenerativeAI(import.meta.env["VITE_GEMINI_API_KEY"]);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [
          {
            text: "Your name is Gembro, and whoever ask your name you should answer you are Gembro and if someone ask you 'what are you based?' or something similar answer that you are based on gemini api.",
          },
        ],
      },
      {
        role: "model",
        parts: [{ text: "Oke sure." }],
      },
    ],
  });

  return chat;
}

export default Gemini;
