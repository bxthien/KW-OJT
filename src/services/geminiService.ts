import axios from "axios";

const API_KEY = "AIzaSyD7b5APqoteW9I0PZIYXFWxYoX7Cdg5UoI";
const BASE_URL = "https://api.gemini.com/v1";

export const callGeminiAPI = async (endpoint: string, payload: any) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/${endpoint}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Gemini API 호출 실패:", error);
    throw error;
  }
};

export const formatDataForGemini = (data: any[]) => {
  return data
    .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
    .join("\n\n");
};
