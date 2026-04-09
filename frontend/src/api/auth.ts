const IP_ADDRESS = "192.168.55.135"; // Your Mac IP
const BASE_URL = `http://${IP_ADDRESS}:8000/api`;


export const registerUser = async (userData: object) => {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  };