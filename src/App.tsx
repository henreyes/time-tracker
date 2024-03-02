import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

function App() {
  const handleNewSessionClick = async () => {
    try {
      await invoke('start_session', { description: 'testing' });
      console.log('New session started');
    } catch (error) {
      console.error('Error starting new session:', error);
    }
  };
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
      start: 'Feb 29, 2024 12:46 PM',
      end: 'Feb 29, 2024 12:49 PM',
      breakHours: 0.05,
      hoursWorked: 1.22
    },
  ];


  return (
    
    <>
      <div className="flex h-screen bg-stone-700">
      {/* Sidebar */}
        <div className="w-1/4 bg-stone-500 p-4 flex flex-col items-center rounded-tr-md">
          <div className="mb-4">
            <button className="bg-gray-300 p-3 rounded-md" onClick={handleNewSessionClick}>New Session</button>
          </div>
        <div>
          <button className="bg-gray-300 p-3 rounded-md">End Session</button>
        </div>
        <div className="m-5"></div>
        <button className="bg-gray-300 w-full hover:bg-gray-400"> Today </button>
        <button className="bg-gray-300 w-full hover:bg-gray-400"> Daily Overview </button>
        <button className="bg-gray-300 w-full hover:bg-gray-400"> Weekly Overview </button>
      </div>

      {/* Main content */}
      <div className="w-3/4 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">Time Tracker</h1>
        </div>
        <div className="overflow-x-auto mt-6">
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="border-b-2 border-gray-200 px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Description
            </th>
            <th className="border-b-2 border-gray-200 px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Start
            </th>
            <th className="border-b-2 border-gray-200 px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
              End
            </th>
            <th className="border-b-2 border-gray-200 px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Break (Hours)
            </th>
            <th className="border-b-2 border-gray-200 px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
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

    </>
   
  );
}

export default App;
