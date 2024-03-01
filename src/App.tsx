import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  interface Session {
    description: string;
    start: string;
    end: string;
    breakHours: number;
    hoursWorked: number;
  }
  const sessions: Session[] = [
    {
      description: 'Set up the end session button',
      start: 'Feb 26, 2024 12:46 PM',
      end: 'Feb 26, 2024 12:49 PM',
      breakHours: 0.05,
      hoursWorked: 1.22
    },
  ];

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    
    <>
        <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white p-4">
        <div className="mb-4">
          <button className="bg-gray-300 p-3 rounded-md">New Session</button>
        </div>
        <div>
        <button className="bg-gray-300 p-3 rounded-md">End Session</button>
        </div>
      </div>

      {/* Main content */}
      <div className="w-3/4 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Time Tracker</h1>
        </div>
        <div className="overflow-x-auto mt-6">
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="border-b-2 border-gray-200 px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Description
            </th>
            <th className="border-b-2 border-gray-200 px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Start
            </th>
            <th className="border-b-2 border-gray-200 px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              End
            </th>
            <th className="border-b-2 border-gray-200 px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Break (Hours)
            </th>
            <th className="border-b-2 border-gray-200 px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Hours Worked
            </th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session, index) => (
            <tr key={index}>
              <td className="border-b border-gray-200 px-5 py-5 text-sm">
                {session.description}
              </td>
              <td className="border-b border-gray-200 px-5 py-5 text-sm">
                {session.start}
              </td>
              <td className="border-b border-gray-200 px-5 py-5 text-sm">
                {session.end}
              </td>
              <td className="border-b border-gray-200 px-5 py-5 text-sm">
                {session.breakHours}
              </td>
              <td className="border-b border-gray-200 px-5 py-5 text-sm">
                {session.hoursWorked}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      </div>
    </div>
    <div className="bg-blue-400">
      <h1>Time Tracker</h1>

      <div className="">
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
        className="bg-yellow-500 text-white font-bold py-2 px-4 rounded"

        >Greet</button>
      </form>

      <p>{greetMsg}</p>
    </div>
    </>
   
  );
}

export default App;
