import { invoke } from "@tauri-apps/api/tauri";
import { useState, useRef, useEffect } from "react";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionDescription, setSessionDescription] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [sessions, setSessions] = useState<Session[]>([]);

  const handleNewSesion = () => {
    setSessionDescription('');
    setIsModalOpen(true);
  };
  useEffect(() => {
    if (isModalOpen) {
      inputRef.current?.focus();
    }
  }, [isModalOpen]);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const fetchedSessions = await invoke<string>('get_sessions');
      const sessionsData: Session[] = JSON.parse(fetchedSessions);
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleModalSubmit = async () => {
    try {
      await invoke('start_session', { description: sessionDescription });
      setIsModalOpen(false);
      fetchSessions();
    } catch (error) {
      console.error('Error starting new session:', error);
    }
  };

  const handleEndSession = async () => {
    if (sessions.length === 0 || sessions[0].end_time) {
      return;
    }
    try {
      await invoke('end_session', { id: sessions[0].id });
      fetchSessions();
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  interface Session {
    id: number;
    description: string;
    start_time: string;
    end_time?: string | null;
    hours_worked?: number | null;
  }
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };


  return (
    
    <>
      <div className="flex h-screen bg-slate-800">
      {/* Sidebar */}
        <div className="w-1/4 bg-stone-500 p-4 flex flex-col items-center rounded-tr-md">
          <div className="mb-4">
            <button className="bg-gray-300 p-3 rounded-md" onClick={handleNewSesion}>
              <svg height="32" width="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="text-gray-800">
                <path d="m7 28a1 1 0 0 1 -1-1v-22a1 1 0 0 1 1.4819-.8763l20 11a1 1 0 0 1 0 1.7525l-20 11a1.0005 1.0005 0 0 1 -.4819.1238z" fill="currentColor"/>
                <path d="m0 0h32v32h-32z" fill="none"/>
              </svg>
            </button>
          </div>
        <div>
          <button className="bg-gray-300 p-3 rounded-md" onClick={handleEndSession}>End Session</button>
        </div>
        <div className="m-5"></div>
          <button className="bg-gray-300 w-full hover:bg-gray-400"> Today </button>
          <button className="bg-gray-300 w-full hover:bg-gray-400"> Daily Overview </button>
          <button className="bg-gray-300 w-full hover:bg-gray-400"> Weekly Overview </button>
      </div>
      <div>
      </div>
      {/* Main content */}
      <div className="w-3/4 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Time Tracker</h1>
      </div>
      {/* session component */}
      {sessions.map((session, index) => (
          <div key={session.id} className="rounded-md w-3/4 p-4 bg-blue-400 m-5">
            {/* Other session details */}
            <div className="flex flex-wrap md:flex-nowrap">
                
              <div className="text-cyan-950 font-bold mr-5 whitespace-nowrap">
                Start Time:
              </div>
              <div className="text-white font-semibold flex-1 min-w-0">
                <p className="truncate">{formatDate(session.start_time)}</p>
              </div>
            </div>
            <div className="flex flex-wrap md:flex-nowrap">
              <div className="text-cyan-950 font-bold mr-5 whitespace-nowrap">
                End Time:
              </div>
              <div className="text-white font-semibold flex-1 min-w-0">
                <p className="truncate">
                  {session.end_time ? formatDate(session.end_time) : "In Progress"}
                </p>
              </div>
            </div>
          </div>
        ))}
    </div>

    </div>
    {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded">
            <h2 className="text-lg mb-4">Start New Session</h2>
            <input
              ref={inputRef}
              type="text"
              className="border p-2 rounded w-full"
              placeholder="Enter description"
              value={sessionDescription}
              onChange={(e) => setSessionDescription(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <button
                className="bg-blue-500 text-white p-2 rounded mr-2"
                onClick={handleModalSubmit}
              >
                Start Session
              </button>
              <button
                className="bg-red-500 text-white p-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
   
  );
}

export default App;
