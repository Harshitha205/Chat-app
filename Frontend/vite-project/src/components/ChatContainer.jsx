// src/components/ChatContainer.jsx (Revised with Debugging Logs)
import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    setSelectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    users, // Ensure 'users' is imported from useChatStore
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const { userId } = useParams(); // Get userId from URL parameters

  console.log("ChatContainer Rendered!");
  console.log("Current selectedUser (state):", selectedUser);
  console.log("User ID from URL (userId):", userId);
  console.log("All users from store (users):", users);


  // Effect to set the selectedUser based on the URL
  useEffect(() => {
    console.log("useEffect for userId/users triggered.");
    if (userId && users.length > 0) {
      const userToSelect = users.find((user) => user._id === userId);
      if (userToSelect) {
        console.log("Found user to select from URL:", userToSelect);
        setSelectedUser(userToSelect);
      } else {
        console.log("User from URL not found in users array. Setting selectedUser to null.");
        setSelectedUser(null); // Ensure selectedUser is null if not found
      }
    } else {
      console.log("No userId in URL or users array is empty. Setting selectedUser to null.");
      setSelectedUser(null); // Ensure selectedUser is null when no specific chat is selected
    }
  }, [userId, users, setSelectedUser]);


  // IMPORTANT: This condition now correctly renders the placeholder for no selected user
  if (!selectedUser || !selectedUser._id) {
    console.log("Rendering 'Select a contact' placeholder because no user is selected.");
    return (
      <div className="flex-1 flex items-center justify-center bg-base-200 text-gray-500 text-lg font-medium p-4 rounded-lg m-4">
        Select a contact from the sidebar to start chatting.
      </div>
    );
  }

  // Debugging: Log when chat interface starts rendering
  console.log("Rendering Chat Interface for:", selectedUser.fullName);


  useEffect(() => {
    console.log("useEffect for fetching messages and subscribing triggered.");
    if (selectedUser && selectedUser._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }

    return () => {
      console.log("Cleanup function for ChatContainer useEffect triggered.");
      // Only unsubscribe if a socket exists to prevent errors
      const socket = useAuthStore.getState().socket;
      if (socket) {
        unsubscribeFromMessages();
      }
    };
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]); // Dependency array


  useEffect(() => {
    console.log("useEffect for scrolling to bottom triggered. Messages count:", messages.length);
    if (messageEndRef.current && messages && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    console.log("Messages are loading. Displaying skeleton.");
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-base-100">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  console.log("Displaying actual chat messages. Message count:", messages.length);
  return (
    <div className="flex-1 flex flex-col overflow-auto bg-base-100">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isMessagesLoading && (
          <div className="flex justify-center items-center h-full text-gray-500">
            Send the first message to {selectedUser.fullName}!
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        {/* Place the ref on a div at the very end of the messages list */}
        <div ref={messageEndRef}></div>
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;