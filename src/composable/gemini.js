import { GoogleGenerativeAI } from "@google/generative-ai";

function Gemini() {
  const genAI = new GoogleGenerativeAI(import.meta.env["VITE_GEMINI_API_KEY"]);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const chat = model.startChat({
    history: [],
  });

  return chat;
}

export default Gemini;
