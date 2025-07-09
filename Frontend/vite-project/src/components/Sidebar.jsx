// src/components/Sidebar.jsx
import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { users, selectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const navigate = useNavigate();

  // Memoize this calculation for performance if needed, but this is fine for now
  const otherUsers = users.filter(user => user._id !== authUser?._id);
  const filteredUsers = showOnlineOnly ? otherUsers.filter((user) => onlineUsers.includes(user._id)) : otherUsers;

  const renderContent = () => {
    // If the API call is running, show skeleton
    if (isUsersLoading) {
      return <SidebarSkeleton />;
    }
    // If there are no other users in the database
    if (otherUsers.length === 0) {
      return <div className="text-center text-sm text-gray-500 py-4">No contacts found.</div>;
    }
    // If "Show online only" is checked and none are online
    if (filteredUsers.length === 0 && showOnlineOnly) {
      return <div className="text-center text-sm text-gray-500 py-4">No online users found.</div>;
    }
    // Otherwise, map and display the users
    return filteredUsers.map((user) => (
      <button key={user._id} onClick={() => navigate(`/chat/${user._id}`)} className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${selectedUser?._id === user._id ? "bg-base-300" : ""}`}>
        <div className="relative mx-auto lg:mx-0">
          <div className="avatar">
             <div className="w-12 rounded-full">
                <img src={user.profilePic || "/avatar.png"} alt="User Avatar" />
             </div>
          </div>
          {onlineUsers.includes(user._id) && (
            <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100" />
          )}
        </div>
        <div className="hidden lg:block text-left min-w-0">
          <div className="font-medium truncate">{user.fullName}</div>
          <div className={`text-sm ${onlineUsers.includes(user._id) ? "text-green-500/80" : "text-gray-400"}`}>
            {onlineUsers.includes(user._id) ? "Online" : "Offline"}
          </div>
        </div>
      </button>
    ));
  };

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input type="checkbox" checked={showOnlineOnly} onChange={(e) => setShowOnlineOnly(e.target.checked)} className="checkbox checkbox-sm" />
            <span className="text-sm">Show online only</span>
          </label>
        </div>
      </div>
      <div className="overflow-y-auto w-full py-3">
        {renderContent()}
      </div>
    </aside>
  );
};

export default Sidebar;