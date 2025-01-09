import React, { useState } from "react";
import { callGeminiAPI } from "../services/geminiService"; // Gemini API 호출 함수 가져오기

const ChatbotIcon: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // 챗봇 창 열림/닫힘 상태
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]); // 대화 기록
  const [inputValue, setInputValue] = useState(""); // 입력값
  const [loading, setLoading] = useState(false); // 로딩 상태

  // Firestore 없이 prompt 생성
  const createPrompt = async (userInput: string) => {
    return `Q: ${userInput}\nA:`; // 사용자 입력만 포함한 간단한 prompt
  };

  // 메시지 전송 핸들러
  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return; // 빈 입력값 무시

    // 사용자 메시지 추가
    const userMessage = { user: inputValue, bot: "" };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue(""); // 입력창 초기화

    setLoading(true); // 로딩 시작
    try {
      // Firestore 데이터를 포함하지 않은 prompt 생성
      const prompt = await createPrompt(inputValue);

      // Gemini API 호출
      const botResponse = await callGeminiAPI("generate-text", {
        model: "text-generation",
        prompt: prompt, // 간단한 prompt 전달
        max_tokens: 100, // 최대 응답 길이
      });

      // 봇 응답 추가
      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1 ? { ...msg, bot: botResponse.generated_text } : msg
        )
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1
            ? { ...msg, bot: "Sorry, something went wrong." }
            : msg
        )
      );
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <>
      {/* 챗봇 아이콘 */}
      <button
        className="fixed bottom-4 right-4 bg-blue-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M12 2a7 7 0 00-7 7v4.59a1 1 0 01-.293.707L3.586 16H7a1 1 0 011 1v3.414l2.707-2.707A1 1 0 0111.414 18H17a1 1 0 011-1h3.414l-1.121-1.121A1 1 0 0120 13.59V9a7 7 0 00-7-7zm-5 7a5 5 0 1110 0v5.59l1.707 1.707A1 1 0 0119.414 16H17v3.414l-2.707-2.707A1 1 0 0113.586 16H11a1 1 0 01-.707-.293L8 13.414V9z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* 챗봇 대화창 */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 h-96 bg-white p-4 shadow-lg rounded-md flex flex-col text-sm">
          <h3 className="text-base font-semibold mb-2">Chatbot</h3>
          {/* 대화 내용 */}
          <div className="flex-1 overflow-y-auto mb-4 border border-gray-300 rounded-md p-2 bg-gray-50 text-xs">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div key={index} className="mb-2">
                  <div className="p-2 bg-blue-100 text-gray-800 rounded-md text-xs">
                    <strong>You:</strong> {message.user}
                  </div>
                  {message.bot && (
                    <div className="p-2 bg-gray-100 text-gray-800 rounded-md text-xs mt-1">
                      <strong>Bot:</strong> {message.bot}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400">No messages yet</p>
            )}
          </div>
          {/* 입력란과 버튼 */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              style ={{color:"black"}}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={loading}
            />
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs"
              onClick={handleSendMessage}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotIcon;
