import { invoke } from "@tauri-apps/api/tauri";
import { useState, useRef, useEffect } from "react";
import { formatDateOnly, formatTime, localTimeZone, Session } from "./util";

function App() {
  const [sessionDescription, setSessionDescription] = useState('');
  const [isStartingNewSession, setIsStartingNewSession] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleNewSessionToggle = () => {
    if (sessions.length > 0 && !sessions[0].end_time) {
      setAlertMessage("Cannot start a new session while there's an active session.");
      setShowAlert(true);
      return;
    }
    setIsStartingNewSession(!isStartingNewSession);
    setSessionDescription('');
    if (!isStartingNewSession) {
      setTimeout(() => inputRef.current?.focus(), 150); 
    }
  };

  const generateSession = async () => {
    try {
      await invoke('start_session', { description: sessionDescription });
      fetchSessions();
    } catch (error) {
      console.error('Error starting new session:', error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const { start, end } = localTimeZone();
    try {
      const fetchedSessions = await invoke<string>('get_sessions', { start, end });;
      const sessionsData: Session[] = JSON.parse(fetchedSessions);
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error fetching sessions:', error);
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
  return (
    
    <>
      <div className="flex h-full bg-emerald-950">
      {/* Sidebar */}
      <div className="w-1/4 bg-emerald-800/75 p-4  h-full flex flex-col items-center rounded-tr-md">
          <div className={`mb-4 transition-all duration-300 ease-in-out ${isStartingNewSession ? 'w-auto' : 'w-auto'}`}>
            {isStartingNewSession ? (
              <input
                ref={inputRef}
                type="text"
                className="border p-2 rounded w-full bg-stone-300 focus:outline-none"
                placeholder="Enter description"
                value={sessionDescription}
                onChange={(e) => setSessionDescription(e.target.value)}
                onBlur={() => setIsStartingNewSession(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && sessionDescription.trim() !== "") {
                    generateSession();
                  }
                }}
              />
            ) : (
              <button className="bg-gray-300 p-3 rounded-md flex items-center" onClick={handleNewSessionToggle}>
                <p>Start Session</p>
                <svg height="32" width="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="text-gray-800">
                <path d="m7 28a1 1 0 0 1 -1-1v-22a1 1 0 0 1 1.4819-.8763l20 11a1 1 0 0 1 0 1.7525l-20 11a1.0005 1.0005 0 0 1 -.4819.1238z" fill="currentColor"/>
                <path d="m0 0h32v32h-32z" fill="none"/>
              </svg>
              </button>
            )}
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
    <div className="w-3/4 p-4 h-screen  overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Time Tracker</h1>
      </div>
      {showAlert && (
        <div className="bg-red-900 w-3/4 m-5 p-2 rounded hover:bg-opacity-50" onClick={() => setShowAlert(false)}>
          <p className="text-red-400">{alertMessage}</p>
        </div>
      )}
      {sessions.length === 0 ? (
        <div className="text-white text-lg">No assignments tracked today.</div>
      ) : (
        sessions.map((session) => (
          <div key={session.id} className="rounded-md w-3/4 p-4 bg-gradient-to-br from-green-400 to-emerald-500  m-5">
            <div className="w-fit  text-white  rounded-lg  font-bold">{session.description}</div>
            <div className="font-semibold text-emerald-700"> {formatDateOnly(session.start_time).toLowerCase()}</div>
            {session.end_time ? (

          <div className="flex flex-wrap md:flex-nowrap">
            <div className="text-emerald-900 font-bold mr-2 whitespace-nowrap">
              Duration:
            </div>
            <div className="text-emerald-800 font-semibold flex-1 min-w-0">
              <p className="truncate">
                {`${formatTime(session.start_time)} - ${formatTime(session.end_time)}`}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap md:flex-nowrap">
            <div className="text-emerald-900 font-bold mr-2 whitespace-nowrap">
              Started At:
            </div>
            <div className="text-emerald-800 font-semibold flex-1 min-w-0">
              <p className="truncate">{formatTime(session.start_time)}</p>
            </div>
          </div>
        )}
          </div>
        ))
      )}
    </div>
    </div>
    </>
  );
}

export default App;
