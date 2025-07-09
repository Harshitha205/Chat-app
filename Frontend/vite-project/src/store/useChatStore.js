// src/store/useChatStore.js
import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore"; // <--- Correctly import useAuthStore from its own file

// onNewMessage listener function (defined once outside the store for consistent reference)
const onNewMessage = (newMessage) => {
  const { selectedUser, messages } = useChatStore.getState();

  // Only update messages if the new message is for the currently selected user
  if (selectedUser && newMessage.senderId === selectedUser._id) {
    useChatStore.setState({ messages: [...messages, newMessage] });
  }
};

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  setSelectedUser: (user) => {
    set({ selectedUser: user, messages: [] });
  },

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/api/messages/users"); // Correct API route
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ messages: [], isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/api/messages/${userId}`); // Correct API route
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get messages");
      set({ messages: [] });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    if (!selectedUser) {
      toast.error("No user selected to send message to.");
      return;
    }
    try {
      const res = await axiosInstance.post(`/api/messages/send/${selectedUser._id}`, messageData); // Correct API route
      set((state) => ({ messages: [...state.messages, res.data] }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket; // Access socket from useAuthStore
    if (!socket) {
      console.warn("Socket not available for subscribing to messages.");
      return;
    }
    socket.on("newMessage", onNewMessage);
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket; // Access socket from useAuthStore
    if (!socket) {
      console.warn("Socket not available for unsubscribing from messages.");
      return;
    }
    socket.off("newMessage", onNewMessage);
  },
}));