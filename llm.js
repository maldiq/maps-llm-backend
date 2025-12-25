import axios from "axios";
import { OLLAMA_BASE_URL } from "./config.js";

export async function askLLM(prompt) {
    try {
        const response = await axios.post(
            `${OLLAMA_BASE_URL}/api/generate`,
            {
                model: "llama3",
                prompt: prompt,
                stream: false,
            }
            // {
            //     timeout: 180000, // 3 minutes, MANDATORY
            // }
        );

        return response.data.response;
    } catch (error) {
        // Debugging output
        console.error("=== OLLAMA ERROR ===");
        if (error.response) {
            console.error(error.response.status);
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }
        throw error;
    }
}
