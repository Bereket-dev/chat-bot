import axios from "axios";

const SERVER_URL =
   import.meta.env.VITE_SERVER_URL?.trim() || "http://localhost:5000";

export const aiResponseAPI = async (messages: string[]) => {
   try {
      const response = await axios.post(`${SERVER_URL}/generate-response`, { messages });
      return response.data;
   } catch (error) {
      console.error('AI Response Error: ', error);
      throw error;
   }
}
