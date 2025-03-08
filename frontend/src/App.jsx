import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { IoSend } from "react-icons/io5";
import Button from "./components/Button";
import Banner from "./components/Banner";
import Popup from "./components/Popup";
import ChatInterface from "./components/ChatInterface"; // Import the ChatInterface component

const socket = io(import.meta.env.VITE_SOCKET_URL);

const App = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [partnerDisconnected, setPartnerDisconnected] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup1, setShowPopup1] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showFinfMatches, setShowFinfMatches] = useState(false);
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
    setShowFinfMatches(false);
  };

  const handleFindMatch = () => {
    setShowDisclaimer(false);
    setShowFinfMatches(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8D6B3] to-gray-200 text-gray-800">
      {/* Disclaimer Popup */}
      {showDisclaimer && (
        <Popup
          show={showDisclaimer}
          title="Disclaimer"
          onConfirm={handleFindMatch}
          confirmLabel="Faham, bro!"
          confirmColor="blue"
        >
          <p className="text-gray-600 mb-6">
            Bro, chat app ni just untuk hiburan je. <br /> Jangan sesekali share info peribadi atau benda sensitif, okay? <br />  
            Jangan spread negativity. <br /> Jangan guna perkataan kesat ataupun lucah. <br />Jangan cakap abang tak warning.
          </p>
          
        </Popup>
      )}

      {/* Banner Section */}
      <Banner />

      {/* Chat Interface */}
      <ChatInterface
        isMatched={isMatched}
        partnerDisconnected={partnerDisconnected}
        messages={messages}
        isTyping={isTyping}
        message={message}
        setMessage={setMessage}
        handleTyping={handleTyping}
        handleSendMessage={handleSendMessage}
        handleFindNewChat={handleFindNewChat}
        messagesEndRef={messagesEndRef}
      />

      {/* Popup for Finding New Chat */}
      <Popup
        show={showPopup}
        title="Confirm nak cari member baru?"
        onConfirm={confirmFindNewChat}
        onCancel={() => setShowPopup(false)}
        confirmLabel="Ya"
        cancelLabel="Tak"
        confirmColor="green"
        cancelColor="pink"
      />

      {/* Popup for Partner Disconnected */}
      <Popup
        show={showPopup1}
        title="Member dah cau, cari baru la ekk?"
        onConfirm={handleNewChatAfterDisconnect}
        confirmLabel="Ya"
        confirmColor="green"
      />

      {/* Popup for Finding Matches */}
      <Popup
        show={showFinfMatches}
        title="Ready Nak Cari Member Baru?"
        onConfirm={handleNewChatAfterDisconnect}
        confirmLabel="Ye Bro"
        confirmColor="blue"
      />

      {/* Footer */}
      <div className="mt-5 text-center text-gray-500 text-sm">
        <p>by aimanazmi, seorang yang rajin bila malas ✨</p>
        <p>support saya dekat <a className="underline" target="_blank" href="https://sociabuzz.com/aimanazmi/tribe">SociaBuzz.</a> Maceh</p>
      </div>
    </div>
  );
};

export default App;