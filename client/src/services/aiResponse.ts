const SERVER_URL = import.meta.env.VITE_SERVER_URL;
import axios  from 'axios'; 

export const aiResponseAPI = async (messages:string[]) => {
 try {
     const response = await axios.post(`${SERVER_URL}/generate-response`,
        {messages},
        {responseType:'text'}
    );

    return response.data;
 } catch (error) {
    console.error('AI Response Error: ',error);
    throw Error;
 } 
}