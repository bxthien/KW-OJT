import React, { useState } from "react";

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 닥스훈트 이미지 링크
  const idleImage =
    "https://img.icons8.com/?size=100&id=KZyhUKGJ27my&format=png&color=000000"; // 앉아있는 닥스훈트 이미지
  const runningImage =
    "https://img.icons8.com/?size=100&id=Jl3TTGXuPWVx&format=png&color=000000"; // 달리는 닥스훈트 이미지

  // 현재 이미지 상태 결정 (호버 또는 클릭 여부에 따라)
  const currentImage = isHovered || isOpen ? runningImage : idleImage;

  return (
    <>
      {/* 챗봇 아이콘 */}
      <button
        className="fixed bottom-4 right-8 bg-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center border border-gray-300 focus:outline-none z-[1000] transition-transform transform hover:scale-110"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img src={currentImage} alt="Chatbot Icon" className="w-12 h-12" />
      </button>

      {/* 챗봇 대화창 */}
      {isOpen && (
        <div className="absolute bottom-24 right-8 w-96 h-96 bg-white p-4 shadow-2xl rounded-md flex flex-col z-[1100]">
          <h3 className="text-lg font-semibold mb-4 text-center text-blue-600">
            HOTDOG LMS Chatbot
          </h3>
          <div className="flex-1 overflow-y-auto border border-gray-300 rounded-md p-4 bg-gray-50">
            <p className="text-gray-400">Start a conversation...</p>
          </div>
          <div className="mt-4 flex items-center">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
            />
            <button className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
