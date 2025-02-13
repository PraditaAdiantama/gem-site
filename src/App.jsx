import { useState } from "react";
import Gemini from "./composable/gemini";

function App() {
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

    const gemini = Gemini();
    const result = await gemini.sendMessage(prompt);
    setMessages((prev) => [...prev, result.response.text()]);
    setLoad(false);
  }

  return (
    <div className="w-full h-screen">
      <div
        className={
          "flex flex-col items-center gap-5 pt-5 " +
          (messages.length > 0 ? "h-full" : "justify-center h-screen")
        }
      >
        {messages.length == 0 ? (
          <h3 className="dark:text-white text-3xl font-bold">
            Hi, Welcome To Gemsite
          </h3>
        ) : (
          <div className="w-1/2 mx-auto flex flex-col gap-4 grow">
            {messages?.map((message) => (
              <div className="odd:p-3 odd:bg-slate-800 odd:rounded-xl odd:ms-auto w-fit text-white">
                {message}
              </div>
            ))}
          </div>
        )}
        <form
          id="form"
          onSubmit={handleSubmit}
          className={
            "bg-slate-800 md:w-1/2 w-full max-md:mx-5 rounded-2xl mt-5 p-4 h-fit sticky bottom-5"
          }
        >
          <textarea
            autoFocus
            name="prompt"
            className="bg-transparent w-full outline-none dark:text-white/90 resize-none h-fit"
            placeholder="Tanya gembro"
          ></textarea>
          <div className="flex justify-end">
            <button
              disabled={!prompt || load}
              className="px-4 py-2 rounded-xl disabled:bg-slate-500 bg-blue-500"
            >
              Kirim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
