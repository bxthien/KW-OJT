import React, { useState } from "react";

const ChatbotIcon: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      setMessages([...messages, inputValue]);
      setInputValue("");
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
                <div
                  key={index}
                  className="mb-2 p-2 bg-blue-100 text-gray-800 rounded-md text-xs"
                >
                  {message}
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
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotIcon;
