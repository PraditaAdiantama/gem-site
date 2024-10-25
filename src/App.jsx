import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [response, setResponse] = useState(""); // Ubah nama state menjadi response
  const [prompt, setPrompt] = useState(""); // State untuk menyimpan input prompt
  const [load, setLoad] = useState(false);

  // Fungsi untuk memformat teks
  const formatText = (text) => {
    // Pastikan teks tidak null atau undefined
    if (!text) return "";
    // Convert **text** to <strong>text</strong> for bold
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  };

  // Menghitung submit
  function handleSubmit(e) {
    setLoad(true);
    e.preventDefault();
    axios
      .post(
        "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
        {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${prompt}. Jawab menggunakan bahasa yang mudah dimengerti untuk orang awam`,
                },
              ], // Gunakan state prompt
            },
          ],
        },
        {
          headers: {
            "x-goog-api-key": "AIzaSyCV7xxDp1U_o9DLeLc9EeKJ_jTrE93aKOo",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response.data); // Tampilkan hasil dari API
        setResponse(response.data.candidates[0].content.parts[0].text); // Tampilkan hasil dari API
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoad(false);
      });
  }

  return (
    <div className="w-screen h-screen overflow-x-none flex items-start justify-center bg-dark text-white">
      <div className="content w-full h-full border-1 border-black">
        <form
          onSubmit={handleSubmit}
          className="w-full h-full overflow-x-hidden flex flex-col justify-center px-10"
        >
          <div>
            <h2 className="p-1 py-3">Masukkan Prompt anda</h2>
            <input
              className="chatbox border p-1 resize-none border-white bg-transparent w-full min-h-[1em]"
              name="prompt"
              value={prompt} // Gunakan state prompt
              onChange={(e) => setPrompt(e.target.value)} // Update state saat input berubah
            />
          <input
            type="submit"
            className="bg-info text-white p-4 py-1 rounded float-end my-5 cursor-pointer"
          />
          </div>
          <div className="h-2/5 my-10">
            {/* <h2 className="p-1">Respon</h2> */}
            <div
              className="chatbox text-start whitespace-pre-wrap border-t-2 resize-none p-1 border-white w-full"
              // Menggunakan dangerouslySetInnerHTML untuk menyisipkan HTML
              dangerouslySetInnerHTML={{ __html: formatText(response) }}
            />
            {load && <div>Loading...</div>}{" "}
          </div>
          {/* Menampilkan Loading jika dalam status loading */}
        </form>
      </div>
    </div>
  );
}

export default App;
