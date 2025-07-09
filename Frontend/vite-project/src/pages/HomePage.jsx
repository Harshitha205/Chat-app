// src/pages/HomePage.jsx

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  // 1. Get the userId from the URL parameters
  const { userId } = useParams();
  const navigate = useNavigate();
  
  // 2. Get necessary state and functions from the store
  const { users, selectedUser, setSelectedUser, getUsers } = useChatStore();

  // 3. This effect is the key to persistence
  useEffect(() => {
    // Fetch the list of users if it's not already loaded
    if (users.length === 0) {
      getUsers();
    }

    if (userId) {
      // Find the user object that matches the ID from the URL
      const userToSelect = users.find((user) => user._id === userId);
      
      if (userToSelect) {
        setSelectedUser(userToSelect);
      } else if (users.length > 0) {
        // Handle cases where the user ID in the URL is invalid
        // Navigate back to the root to show the "NoChatSelected" component
        navigate("/");
      }
    } else {
      // If there's no ID in the URL, ensure no user is selected
      setSelectedUser(null);
    }
  }, [userId, users, setSelectedUser, getUsers, navigate]);

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {/* This logic now works perfectly on refresh */}
            {selectedUser ? <ChatContainer /> : <NoChatSelected />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;