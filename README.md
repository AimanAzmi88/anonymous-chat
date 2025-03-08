# Mai Sembang - Anonymous Chat App

Mai Sembang is a simple anonymous chat app built using React, Vite, Tailwind CSS, and Socket.io. It allows users to connect with random strangers and chat in real-time.

## Features

- **Random Chat Matching**: Connect with a random user and start chatting.
- **Real-time Messaging**: Powered by Socket.io for instant message delivery.
- **Typing Indicator**: See when the other person is typing.
- **Disconnect & Reconnect**: If your chat partner leaves, you can find a new chat.
- **Notification Sound**: Get notified with a sound when you receive a message.
- **User-Friendly UI**: Clean and modern design using Tailwind CSS.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express, Socket.io

## Installation

### Prerequisites

Make sure you have the following installed:

- **Node.js** (LTS recommended)
- **pnpm** (or npm/yarn)

### Clone the Repository

```sh
git clone https://github.com/AimanAzmi88/chat-app.git
cd chat-app
```

### Install Dependencies

```sh
pnpm install  # or npm install / yarn install
```

### Setup Environment Variables

Create a `.env` file in the root of the project and add:

```env
VITE_SOCKET_URL=http://localhost:5000
```

### Run the App

```sh
pnpm run dev  # or npm run dev / yarn dev
```

## Usage

1. Open the app in your browser.
2. Wait to be matched with a random chat partner.
3. Start chatting!
4. If your chat partner leaves, you can find a new chat.

## Deployment

You can deploy the frontend using Vercel, Netlify, or any static hosting service. Make sure to update `VITE_SOCKET_URL` with your live server URL.

For backend deployment, use a VPS, Heroku, or any cloud provider that supports Node.js.

## Contribution

Feel free to fork this project and submit pull requests. Any contributions to improve the chat experience are welcome!

### Developer

Made by **AimanAzmi** ✨. Support me on [SociaBuzz](https://sociabuzz.com/aimanazmi/tribe)! 🚀
