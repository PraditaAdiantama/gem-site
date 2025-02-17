import { useState, useRef } from "react";
import Gemini from "./composable/gemini";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "./assets/css/highlight.css";

function App() {
  const inputRef = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [load, setLoad] = useState(false);

  const gemini = Gemini();

  // Menghitung submit
  async function handleSubmit(e) {
    e.preventDefault();

    const value = prompt;

    setLoad(true);
    setMessages((prev) => [...prev, value]);
    document.getElementById("form").reset();
    setPrompt("");
    if (inputRef.current) {
      inputRef.current.innerText = "";
    }

    try {
      const result = await gemini.sendMessageStream(value);

      setMessages((prev) => [...prev, ""]);
      let responseText = "";

      for await (const chunk of result.stream) {
        responseText += chunk.text();
	      console.log(chunk.text())
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
          "md:max-w-3xl md:mx-auto mx-4 flex flex-col items-center gap-5 pt-5 transition " +
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
          <div className="w-full flex flex-col gap-5">
            {messages?.map((message, i) => (
              <div key={i} className="odd:p-3 odd:bg-[#404045] odd:rounded-xl odd:ms-auto odd:md:max-w-1/2 w-fit even:max-w-full text-white last:mb-10 break-words prose">
                <ReactMarkdown
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    pre(props) {
                      return (
                        <div>
                          <pre>
                            <div className="h-10 bg-[#404045] rounded-t-xl"></div>
                            {props.children}
                          </pre>
                        </div>
                      );
                    },
                  }}
                >
                  {message}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        )}
        <form
          id="form"
          onSubmit={handleSubmit}
          className="bg-[#404045] w-full rounded-2xl mt-5 px-4 py-3 h-fit md:max-w-3xl mx-auto sticky bottom-9 "
        >
          <textarea
            placeholder="Ask Gembro"
            name="prompt"
            className={
              "text-white absolute resize-none -z-10 " +
              (prompt.trim() != "" ? "hidden" : "")
            }
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
              className="p-2 rounded-full disabled:bg-gray-500 bg-blue-500 text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="m21.426 11.095-17-8A1 1 0 0 0 3.03 4.242l1.212 4.849L12 12l-7.758 2.909-1.212 4.849a.998.998 0 0 0 1.396 1.147l17-8a1 1 0 0 0 0-1.81z"></path>
              </svg>
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
