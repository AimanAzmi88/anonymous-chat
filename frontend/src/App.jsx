import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { IoSend } from "react-icons/io5";

const socket = io(import.meta.env.VITE_SOCKET_URL);

const App = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [partnerDisconnected, setPartnerDisconnected] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup1, setShowPopup1] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true); // State for disclaimer popup
  const messagesEndRef = useRef(null);

  // Create a ref for the audio element
  const audioRef = useRef(new Audio("/notification.mp3"));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.on("receiveMessage", ({ text, timestamp }) => {
      setMessages((prev) => [...prev, { text, isMe: false, timestamp }]);

      // Play the notification sound when a new message is received
      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.error("Failed to play notification sound:", error);
        });
      }
    });

    socket.on("match", () => {
      setIsMatched(true);
      setPartnerDisconnected(false);
      setMessages([]);
    });

    socket.on("partnerLeft", () => {
      setIsMatched(false);
      setPartnerDisconnected(true);
      setMessages([]);
      setShowPopup1(true);
    });

    socket.on("typing", () => {
      setIsTyping(true);
    });

    socket.on("stoppedTyping", () => {
      setIsTyping(false);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("match");
      socket.off("partnerLeft");
      socket.off("typing");
      socket.off("stoppedTyping");
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      const timestamp = new Date().toLocaleTimeString();
      socket.emit("sendMessage", message);
      setMessages((prev) => [...prev, { text: message, isMe: true, timestamp }]);
      setMessage("");
      socket.emit("stoppedTyping");
    }
  };

  const handleTyping = () => {
    socket.emit("typing");
  };

  const handleFindNewChat = () => {
    setShowPopup(true);
  };

  const confirmFindNewChat = () => {
    socket.emit("findNewChat");
    setIsMatched(false);
    setPartnerDisconnected(false);
    setMessages([]);
    setShowPopup(false);
  };

  const handleNewChatAfterDisconnect = () => {
    socket.emit("findNewChatFromDisconnect");
    setPartnerDisconnected(false);
    setShowPopup1(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#212121] to-gray-200 p-4 text-gray-800">
      {/* Disclaimer Popup */}
      {showDisclaimer && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Disclaimer</h2>
          <p className="text-gray-600 mb-6">
            Bro, chat app ni just untuk hiburan je. Jangan sesekali share info peribadi atau benda sensitif, okay?  
            Jangan spread negativity. Jangan guna perkataan kesat ataupun lucah. Jangan cakap abang tak warning.
            .
          </p>
          <button
            onClick={() => setShowDisclaimer(false)}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Faham, bro!
          </button>
        </div>
      </div>
    )}


      {/* Banner Section */}
      <div className="w-full max-w-lg mb-6 bg-white p-4 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800">Mai Sembang</h1>
      </div>

      {/* Chat Interface */}
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md border-4 border-gray-300 p-6">
        <div className="bg-gray-200 p-4 rounded-lg text-center text-gray-800 font-semibold text-lg">
          {isMatched
            ? "Borak ah dah connect!"
            : partnerDisconnected
            ? "Member dah cabut!"
            : "Cari member jap..."}
        </div>

        <div className="p-4 h-72 overflow-y-auto bg-gray-50 border border-gray-200 rounded-lg">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-3 ${msg.isMe ? "text-right" : "text-left"}`}>
              <div className={`inline-block p-3 rounded-lg border-2 shadow-md ${msg.isMe ? "bg-gray-400 border-gray-300 text-white" : "bg-gray-200 border-gray-300 text-gray-800"}`}>
                <div>{msg.text}</div>
                <div className="text-xs mt-1 text-gray-600">{msg.timestamp}</div>
              </div>
            </div>
          ))}
          {isTyping && <div className="text-gray-500 text-sm">Member tengah taip...</div>}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-300 flex flex-row gap-3">
          <input
            type="text"
            placeholder="Tulis something..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button onClick={handleSendMessage} className="bg-gray-400 p-3 rounded-lg border-2 border-gray-300 hover:bg-gray-500">
            <IoSend className="text-white size-6" />
          </button>
        </div>
        {isMatched && ( 
          <div className="p-4 border-t border-gray-300">
            <button onClick={handleFindNewChat} className="w-full bg-red-400 text-white py-3 rounded-lg border-2 border-red-300 hover:bg-red-500">
              Cari Member Baru
            </button>
          </div>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex bg-gray-600/25  items-center justify-center backdrop-blur-xs">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <p className="mb-4 text-lg font-semibold">Confirm nak cari member baru?</p>
            <div className="flex justify-center gap-4">
              <button onClick={confirmFindNewChat} className="bg-gray-500 text-white px-4 py-2 rounded-lg border-2 border-gray-400 hover:bg-gray-600">
                Ya
              </button>
              <button onClick={() => setShowPopup(false)} className="bg-gray-400 text-white px-4 py-2 rounded-lg border-2 border-gray-300 hover:bg-gray-500">
                Tak
              </button>
            </div>
          </div>
        </div>
      )}
      {showPopup1 && (
        <div className="fixed inset-0 flex bg-gray-600/25  items-center justify-center backdrop-blur-xs">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <p className="mb-4 text-lg font-semibold">Confirm nak cari member baru?</p>
            <div className="flex justify-center gap-4">
              <button onClick={handleNewChatAfterDisconnect} className="bg-gray-500 text-white px-4 py-2 rounded-lg border-2 border-gray-400 hover:bg-gray-600">
                Ya
              </button>
            </div>
          </div>
        </div>
      )}

    <div className="mt-5 text-center text-gray-500 text-sm">
        <p>by aimanazmi, seorang yang rajin bila malas ✨</p>
        <p>support saya dekat <a className="underline" target="_blank" href="https://sociabuzz.com/aimanazmi/tribe">SociaBuzz.</a> Maceh</p>
      </div>
    </div>
  );
};

export default App;