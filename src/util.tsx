export interface Session {
    id: number;
    description: string;
    start_time: string;
    end_time?: string | null;
    hours_worked?: number | null;
  }

export const localTimeZone = () => {
    const startOfLocalDay = new Date();
    startOfLocalDay.setHours(0, 0, 0, 0);
    
    const endOfLocalDay = new Date(startOfLocalDay);
    endOfLocalDay.setDate(startOfLocalDay.getDate() + 1);
    endOfLocalDay.setMilliseconds(endOfLocalDay.getMilliseconds() - 1);
  
    return {
      start: startOfLocalDay.toISOString(),
      end: endOfLocalDay.toISOString()
    };
  };

export const formatDateOnly = (dateString: string) => {
    const date = new Date(dateString); 
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

export const formatTime = (dateString: string) => {
    const date = new Date(dateString); 
    const formatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    }); 
    let timeString = formatter.format(date);
  
    timeString = timeString.replace(/^0/, '');
    timeString = timeString.replace(/:0(\d):/, ':$1:');
  
    return timeString;
  };
