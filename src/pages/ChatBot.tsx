import React, { useState, useRef, useEffect } from "react";

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [inputValue, setInputValue] = useState("");

  // 챗봇 프로필 정보
  const botProfile = {
    name: "HotDoggy",
    image:
      "https://img.icons8.com/?size=100&id=Jl3TTGXuPWVx&format=png&color=000000",
  };

  const idleImage =
    "https://img.icons8.com/?size=100&id=KZyhUKGJ27my&format=png&color=000000";
  const runningImage =
    "https://img.icons8.com/?size=100&id=Jl3TTGXuPWVx&format=png&color=000000";

  const currentImage = isHovered || isOpen ? runningImage : idleImage;

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: inputValue },
    ]);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "bot", text: "hello" },
    ]);

    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      <button
        className="fixed bottom-4 right-8 bg-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center border border-gray-300 focus:outline-none z-[1000] transition-transform transform hover:scale-110"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img src={currentImage} alt="Chatbot Icon" className="w-12 h-12" />
      </button>

      {isOpen && (
        <div className="absolute bottom-24 right-8 w-96 h-96 bg-white p-4 shadow-2xl rounded-md flex flex-col z-[1100]">
          <h3 className="text-lg font-semibold mb-4 text-center text-blue-600">
            HOTDOG LMS Chatbot
          </h3>
          <div
            className="flex-1 overflow-y-auto border border-gray-300 rounded-md p-4 bg-gray-50"
            style={{ scrollbarWidth: "none" }}
          >
            <style>
              {`
                ::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            {messages.length === 0 ? (
              <p className="text-gray-400 text-sm">Start a conversation...</p>
            ) : (
              <ul>
                {messages.map((msg, index) => (
                  <li
                    key={index}
                    className={`mb-4 flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.sender === "bot" && (
                      <div className="flex items-start">
                        {/* 챗봇 프로필 이미지 */}
                        <img
                          src={botProfile.image}
                          alt="Bot Profile"
                          className="w-10 h-10 rounded-full mr-2"
                        />
                        <div>
                          {/* 챗봇 이름 */}
                          <p className="text-sm text-gray-500 mb-1">
                            {botProfile.name}
                          </p>
                          {/* 챗봇 메시지 */}
                          <div
                            className="max-w-xs p-2 rounded-lg shadow bg-gray-200 text-gray-800 rounded-bl-none"
                            style={{
                              wordWrap: "break-word",
                              overflowWrap: "break-word",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    )}
                    {msg.sender === "user" && (
                      <div
                        className="max-w-xs p-2 rounded-lg shadow bg-blue-500 text-white rounded-br-none"
                        style={{
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {msg.text}
                      </div>
                    )}
                  </li>
                ))}
                <div ref={bottomRef} />
              </ul>
            )}
          </div>
          <div className="mt-4 flex items-center">
            <input
              type="text"
              className="flex-1 p-2 bg-white text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Type a message..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <button
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
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

export default ChatBot;
