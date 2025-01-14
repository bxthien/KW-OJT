import React, { useState, useRef, useEffect } from "react";

// 이미지 URL 변수 정의
const idleImage =
  "https://img.icons8.com/?size=100&id=KZyhUKGJ27my&format=png&color=000000";
const runningImage =
  "https://img.icons8.com/?size=100&id=Jl3TTGXuPWVx&format=png&color=000000";
// 로딩 이미지 URL 정의
const loadingImage1 =
  "https://img.icons8.com/?size=100&id=Mgul1VWKiLPN&format=png&color=000000";
const loadingImage2 =
  "https://img.icons8.com/?size=100&id=OzaDjT66VCbV&format=png&color=000000";

const ChatBot: React.FC = () => {
  // 이미지 상태 관리
  const [currentImage, setCurrentImage] = useState(idleImage);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentLoadingImage, setCurrentLoadingImage] = useState(loadingImage1);

  // 챗봇 프로필 정보
  const botProfile = {
    name: "HotDoggy",
    image: runningImage,
  };

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  // 로딩 애니메이션
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentLoadingImage((prevImage) =>
          prevImage === loadingImage1 ? loadingImage2 : loadingImage1
        );
      }, 500); // 500ms 간격으로 이미지 변경

      return () => clearInterval(interval); // 컴포넌트가 언마운트되거나 로딩이 끝나면 인터벌 정리
    }
  }, [isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage = inputValue;
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: userMessage },
    ]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userMessage }),
      });

      const data = await response.json();
      if (data.answer) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: data.answer },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: "Sorry, I couldn't fetch an answer." },
        ]);
      }
    } catch (error) {
      console.error("Error fetching response from API:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* 챗봇 아이콘 */}
      <button
        className="fixed bottom-4 right-8 bg-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center border border-gray-300 focus:outline-none z-[1000] transition-transform transform hover:scale-110"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setCurrentImage(runningImage)}
        onMouseLeave={() => setCurrentImage(idleImage)}
      >
        <img src={currentImage} alt="Chatbot Icon" className="w-12 h-12" />
      </button>

      {/* 챗봇 대화창 */}
      {isOpen && (
        <div className="absolute bottom-24 right-8 w-[60%] h-[75%] bg-blue-50 p-6 shadow-2xl rounded-md flex flex-col z-[1100]">
          <h3 className="text-lg font-semibold mb-4 text-center text-blue-600">
            HOTDOG LMS Chatbot
          </h3>
          <div className="flex-1 overflow-y-auto border border-gray-300 rounded-md p-4 bg-gray-50 text-sm">
            {messages.length === 0 ? (
              <p className="text-gray-400">
                Doggy is waiting for admin's orders!
              </p>
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
                        <img
                          src={botProfile.image}
                          alt="Bot Profile"
                          className="w-10 h-10 rounded-full mr-2"
                        />
                        <div
                          className="max-w-md p-3 rounded-lg shadow bg-gray-200 text-gray-800"
                          dangerouslySetInnerHTML={{ __html: msg.text }} // HTML 렌더링
                        />
                      </div>
                    )}
                    {msg.sender === "user" && (
                      <div className="max-w-md p-3 rounded-lg shadow bg-blue-500 text-white">
                        {msg.text}
                      </div>
                    )}
                  </li>
                ))}
                <div ref={bottomRef} />
              </ul>
            )}
          </div>
          {/* 로딩 이미지 */}
          {isLoading && (
            <div className="flex justify-start mt-2">
              <div className="flex items-center">
                <img
                  src={currentLoadingImage}
                  alt="Loading..."
                  className="w-8 h-8"
                />
                <p className="ml-2 text-sm text-gray-500">
                  Hotdoggy is running with an answer...
                </p>
              </div>
            </div>
          )}
          <div className="mt-4 flex items-center">
            <input
              type="text"
              className="flex-1 h-12 p-3 bg-white text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Type a message..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <button
              className="ml-2 h-12 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              onClick={handleSendMessage}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
