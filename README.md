# Chatty - A Real-time MERN Stack Chat Application

Chatty is a modern, full-stack real-time chat application built with the MERN (MongoDB, Express.js, React, Node.js) stack. It provides a seamless and instant messaging experience, featuring user authentication, live status updates, and dynamic theming.

## ✨ Features
- **Real-time Messaging:** Instant message delivery and reception powered by Socket.IO.
- **User Authentication:** Secure user registration, login, and logout functionalities with JWT.
- **One-on-One Chat:** Engage in private conversations with individual contacts.
- **Contact List:** View and select available users to start a chat.
- **Online/Offline Status:** See which users are currently active.
- **Message History:** All conversations are persisted and loaded upon selecting a chat.
- **Profile Management:** Users can update their profile pictures, securely stored on Cloudinary.
- **Dynamic Theming:** Personalize your chat interface with a variety of themes powered by DaisyUI.
- **Responsive UI:** Designed to work smoothly across various devices.

## 🚀 Tech Stack

### Frontend
- **React.js:** A declarative, component-based JavaScript library for building user interfaces.
- **Vite:** A fast build tool that significantly improves the frontend development experience.
- **Zustand:** A small, fast, and scalable bearbones state-management solution for React.
- **Tailwind CSS & DaisyUI:** A utility-first CSS framework combined with a component library for rapid UI development and theming.
- **Axios:** Promise-based HTTP client for making API requests.
- **React Router DOM:** For declarative routing in the React application.
- **Socket.IO Client:** Enables real-time, bidirectional communication between the client and server.
- **React Hot Toast:** A lightweight and customizable notification library.
- **Lucide React:** Beautiful, open-source icons for a clean UI.

### Backend
- **Node.js & Express.js:** A powerful JavaScript runtime and a fast, unopinionated web framework for building robust APIs.
- **MongoDB & Mongoose:** A NoSQL database for flexible data storage, paired with Mongoose as an elegant ODM (Object Data Modeling) library.
- **Socket.IO:** The real-time engine for WebSocket-based communication.
- **JWT (JSON Web Tokens):** For secure, stateless authentication.
- **bcryptjs:** A library to hash passwords securely.
- **Cloudinary:** Cloud-based image and video management service for profile picture storage.
- **Cookie-parser, CORS, dotenv, nodemon:** Essential middleware and tools for development and production.

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### 1. Clone the repository:
```bash
git clone https://github.com/Harshitha205/chatty.git
cd chatty
