import axios from 'axios';

const API_URL = '';  

export const predict = async (features) => {
  try {
    const response = await axios.post(`${API_URL}/predict`, { features });
    return response.data;
  } catch (error) {
    console.error('Error fetching prediction:', error);
    throw error;
  }
};
