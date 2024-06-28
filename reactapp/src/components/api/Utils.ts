import { server } from "../../App";

export const getUserData = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${server}/account/${token}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      return null;
    }

    const userData = await response.json();

    if (isUserValid(userData)) {
      return userData;
    } else {
      throw new Error("Invalid user data");
    }
  } catch (error) {
    console.error("Failed to fetch user data", error);
    return null;
  }
};

export const formatNumber = (num: number) => {
  if (num === undefined || num === null) {
    return num;
  }
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

export const formatTime = (datetimeStr: string) => {
  let datetime = new Date(datetimeStr);
  let datePortion = datetime.toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  let timePortion = datetime.toLocaleString('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false });
  let formatted = `${datePortion} | ${timePortion}`;

  return formatted;
}

export const isUserValid = (user: any): boolean => {
  if (!user) {
    return false;
  }

  if (user === null || user === undefined) {
    return false;
  }

  if (user === "null" || user === "undefined") {
    return false;
  }
  if (user === "User not found") {
    return false;
  }

  return true;
}

export const getMonthNameFromIndex = (monthIndex: number) => {
  const monthNames = [ "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember" ];
  return monthNames[monthIndex];
};

export const getToken = () => {
  return localStorage.getItem('token');
}

export function formatChatTime(time: any) {
  const now: any = new Date();
  const diff = (now - time) / 1000; // in seconds

  if (diff < 60) {
    return 'Gerade eben';
  } else if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `vor ${minutes} Minute${minutes !== 1 ? 'n' : ''}`;
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `vor ${hours} Stunde${hours !== 1 ? 'n' : ''}`;
  } else if (diff < 2592000) {
    const days = Math.floor(diff / 86400);
    return `vor ${days} Tag${days !== 1 ? 'en' : ''}`;
  } else if (diff < 22896000) {
    const months = Math.floor(diff / 2592000);
    return `vor ${months} Monat${months !== 1 ? 'en' : ''}`
  } else {
    const years = Math.floor(diff / 22896000);
    return `vor ${years} Jahr${years !== 1 ? 'en' : ''}`
  }
  
}

export const sendChatMessage = (chat: string, message: string) => {
  const token = getToken();
  fetch(`${server}/messages/${token}/${chat}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: message
    })})
}