import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="">
      <h1>Time Tracker</h1>

      <div className="bg-slate-500 w-1/6 h-10 p-7">
        hello
      </div>

      <p>Keep track of your task time allocation and view history</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit"
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded"

        >Greet</button>
      </form>

      <p>{greetMsg}</p>
    </div>
  );
}

export default App;
