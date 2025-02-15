import { useState, useRef } from "react";
import Gemini from "./composable/gemini";
import ReactMarkdown from "react-markdown";

function App() {
  const inputRef = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [load, setLoad] = useState(false);

  // Menghitung submit
  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const prompt = formData.get("prompt");

    setLoad(true);
    setMessages((prev) => [...prev, prompt]);
    document.getElementById("form").reset();
    setPrompt("");
    if (inputRef.current) {
      inputRef.current.innerText = "";
    }

    try {
      const gemini = Gemini();
      const result = await gemini.sendMessageStream(prompt);

      setMessages((prev) => [...prev, ""]);
      let responseText = "";

      for await (const chunk of result.stream) {
        console.log(chunk.text());
        responseText += chunk.text();
        setMessages((prev) => {
          const arr = [...prev];
          arr[arr.length - 1] = responseText;
          return arr;
        });
      }
    } catch (err) {
    } finally {
      setLoad(false);
    }
  }

  return (
    <div className="w-full min-h-screen overflow-visible">
      <div
        className={
          "md:max-w-3xl mx-auto flex flex-col items-center gap-5 pt-5 transition " +
          (messages.length > 0
            ? "justify-between min-h-screen"
            : "justify-center h-screen")
        }
      >
        {messages.length == 0 ? (
          <h3 className="dark:text-white text-3xl font-bold">
            Hi, Welcome To Gemsite
          </h3>
        ) : (
          <div className="w-full flex flex-col gap-4">
            {messages?.map((message) => (
              <div className="odd:p-3 odd:bg-slate-800 odd:rounded-xl odd:ms-auto even:max-w-full w-fit text-white">
                <ReactMarkdown>{message}</ReactMarkdown>
              </div>
            ))}
          </div>
        )}
        <form
          id="form"
          onSubmit={handleSubmit}
          className="bg-[#404045] w-full max-md:mx-5 rounded-2xl mt-5 p-4 h-fit md:max-w-3xl mx-auto sticky bottom-9 "
        >
          <textarea
            placeholder="Ask Gembro"
            name="prompt"
            className={
              "w-full text-white absolute resize-none -z-10 " +
              (prompt.trim() != "" ? "hidden" : "")
            }
            value={prompt}
          ></textarea>
          <div
            contentEditable={true}
            ref={inputRef}
            className="text-white outline-none max-h-52 overflow-auto"
            onInput={(ev) => setPrompt(ev.target.innerText)}
          ></div>
          <div className="flex justify-end">
            <button
              disabled={load || !prompt}
              className="px-4 py-2 rounded-xl disabled:bg-slate-500 bg-blue-500 text-white"
            >
              Kirim
            </button>
          </div>
        </form>
      </div>
      <p className="fixed bottom-1 w-full text-center text-white/80">
        Ai generated. Api by Gemini.
      </p>
    </div>
  );
}

export default App;
