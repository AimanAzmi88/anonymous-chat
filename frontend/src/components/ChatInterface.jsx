import React from 'react';
import PropTypes from 'prop-types';
import { IoSend } from 'react-icons/io5';
import Button from './Button';

const ChatInterface = ({
  isMatched,
  partnerDisconnected,
  messages,
  isTyping,
  message,
  setMessage,
  handleTyping,
  handleSendMessage,
  handleFindNewChat,
  messagesEndRef,
}) => {
  return (
    <div className="w-full max-w-lg bg-white rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black p-5" style={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>


      <div
        className=" flex-1 overflow-y-auto border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        style={{
          backgroundImage: `url(/background.jpg)`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat', 
        }}
      >
        <div className="bg-[#B399D4] rounded-t-sm text-center text-gray-800 font-bold text-lg border-2">
            {isMatched
            ? "Borak ah dah connect!"
            : partnerDisconnected
            ? "Member dah cabut!"
            : "Cari member jap..."}
      </div>
        <div className='p-4'>
        {messages.map((msg, index) => (
          <div key={index} className={`mb-3 ${msg.isMe ? "text-right" : "text-left"}`}>
            <div className={`inline-block p-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${msg.isMe ? "bg-[#4C8BF5] text-white" : "bg-[#FFD600] text-gray-800"}`}>
              <div>{msg.text}</div>
              {!msg.isMe ? <div className="text-xs mt-1 text-gray-600">{msg.formattedTimestamp}</div>:
              <div className="text-xs mt-1 text-gray-600">{msg.timestamp}</div>}
            

            </div>
          </div>
        ))}
        {isTyping && <div className="text-gray-700 text-sm">Member tengah taip...</div>}
        <div ref={messagesEndRef} />
      </div>
        </div>        

      {/* Input Area */}
      <div className="pt-2 border-t-2 border-black flex flex-col gap-3">
        <div className="flex flex-row gap-3">
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
            className="w-full p-3 border-2 border-black rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          />
          <button
            onClick={handleSendMessage}
            className="bg-[#FF007F] p-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            <IoSend className="text-white size-6" />
          </button>
        </div>

        {isMatched && ( 
          <Button
            onClick={handleFindNewChat}
            label="Cari Member Baru"
            color="red"
          />
        )}
      </div>
    </div>
  );
};

ChatInterface.propTypes = {
  isMatched: PropTypes.bool.isRequired,
  partnerDisconnected: PropTypes.bool.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      isMe: PropTypes.bool.isRequired,
      timestamp: PropTypes.string.isRequired,
    })
  ).isRequired,
  isTyping: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  setMessage: PropTypes.func.isRequired,
  handleTyping: PropTypes.func.isRequired,
  handleSendMessage: PropTypes.func.isRequired,
  handleFindNewChat: PropTypes.func.isRequired,
  messagesEndRef: PropTypes.object.isRequired,
};

export default ChatInterface;