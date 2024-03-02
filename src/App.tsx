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
      <div className="flex h-screen bg-slate-800">
      {/* Sidebar */}
        <div className="w-1/4 bg-stone-500 p-4 flex flex-col items-center rounded-tr-md">
          <div className="mb-4">
            <button className="bg-gray-300 p-3 rounded-md" onClick={handleNewSessionClick}>
              <svg height="32" width="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="text-gray-800">
                <path d="m7 28a1 1 0 0 1 -1-1v-22a1 1 0 0 1 1.4819-.8763l20 11a1 1 0 0 1 0 1.7525l-20 11a1.0005 1.0005 0 0 1 -.4819.1238z" fill="currentColor"/>
                <path d="m0 0h32v32h-32z" fill="none"/>
              </svg>
            </button>
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
  {/* session component */}
  <div className="rounded-md w-3/4 p-4 bg-blue-400">
    <div className="flex flex-wrap md:flex-nowrap">
      <div className="text-cyan-950 font-bold mr-5 whitespace-nowrap">
        Description: 
      </div>
      <div className="text-white font-medium flex-1 min-w-0">
        <p className="truncate">description body fasdfafasfafgafa</p>
      </div>
    </div>
    <div className="flex flex-wrap md:flex-nowrap">
      <div className="text-cyan-950 font-bold mr-5 whitespace-nowrap">
        Start Time: 
      </div>
      <div className="text-white font-semibold flex-1 min-w-0">
        <p className="truncate">1:34pm</p>
      </div>
    </div>
    <div className="flex flex-wrap md:flex-nowrap">
      <div className="text-cyan-950 font-bold mr-5 whitespace-nowrap">
        End Time: 
      </div>
      <div className="text-white font-semibold flex-1 min-w-0">
        <p className="truncate">2:30pm</p>
      </div>
    </div>
  </div>
</div>

    </div>

    </>
   
  );
}

export default App;
