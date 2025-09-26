import { useState } from "react";
import { X, Search, Trash2 } from "lucide-react";
import { appAxios } from "../../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  addRecentUser,
  removeRecentUser,
  clearRecentUsers,
} from "../../../store/recentUsersSlice";
import type { RootState } from "../../../store";
import { type UserChatT, type UserT } from "../../../types/appTypes";
import { setActiveChat } from "../../../store/userChatsSlice";

export default function NewChatPane({ onClose }: { onClose: () => void }) {
  const recentUsers = useSelector(
    (state: RootState) => state.recentUsers.value,
  );

  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState<UserT | null>(null);
  const [isSearching, setSearching] = useState(false);

  const searchMode = searchInput.trim() !== "";

  if (searchInput !== searchResult?.username && searchResult) {
    setSearchResult(null);
  }

  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const handleSearch = async () => {
    if (!searchInput.trim()) return;

    // check if already in list (Redux handles duplication too)
    try {
      setSearching(true);
      setError("");

      const existingUserIndex = recentUsers.findIndex(
        (u) => u.username === searchInput.trim(),
      );

      if (existingUserIndex < 0) {
        const resp = await appAxios.get(
          `/app/user/find_user?eu=${searchInput}`,
        );

        const foundUser = resp.data;

        dispatch(addRecentUser(foundUser));
        setSearchResult(foundUser);
      } else {
        setSearchResult(recentUsers[existingUserIndex]);
      }
    } catch (err: any) {
      setError("User not found");
    } finally {
      setSearching(false);
    }
  };

  const handleUserClick = (user: UserT) => {
    const userChat: UserChatT = {
      chat_type: "DM",
      chat_ident: user.username,
      unread_messages_count: 0,
      partner: user,
    };

    dispatch(setActiveChat(userChat));
    onClose();
  };

  const renderSnippet = (user: UserT) => (
    <div
      key={user.username}
      className="group flex items-center p-3 hover:bg-gray-50 border-b cursor-pointer"
      onClick={() => handleUserClick(user)}
    >
      {/* Profile picture with presence indicator */}
      <div className="w-12 h-12 mr-3">
        {user.profile_pic_url ? (
          <img
            src={user.profile_pic_url}
            alt={user.username}
            className="w-12 h-12 rounded-full object-cover bg-gray-300"
          />
        ) : (
          <span className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500 text-white font-medium">
            {user.username.charAt(0)?.toUpperCase()}
          </span>
        )}
      </div>

      {/* User info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{user.username}</h3>
        <p className="text-sm text-gray-500 truncate">{user.bio}</p>
      </div>

      {/* Remove button (hover only) */}
      {searchMode || (
        <button
          onClick={(ev) => {
            ev.stopPropagation();
            dispatch(removeRecentUser(user.username));
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X size={16} className="text-gray-400 hover:text-red-500" />
        </button>
      )}
    </div>
  );

  return (
    <div className="absolute inset-0 bg-white z-20 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">New Chat</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
          <X size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center p-3 border-b space-x-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search username"
          className="flex-1 border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          <Search size={16} />
        </button>
      </div>

      {/* Error */}
      {error && searchMode && (
        <div className="p-3 text-sm text-red-600 border-b bg-red-50">
          {error}
        </div>
      )}

      {/* Results / Recent users */}
      <div className="flex-1 overflow-y-auto">
        {searchMode
          ? searchResult
            ? renderSnippet(searchResult)
            : null
          : recentUsers.map((u) => renderSnippet(u))}
      </div>

      {/* Clear button */}
      {recentUsers.length > 0 && !searchResult && (
        <div className="p-3 border-t">
          <button
            onClick={() => dispatch(clearRecentUsers())}
            className="flex items-center text-sm text-red-600 hover:text-red-800"
          >
            <Trash2 size={14} className="mr-1" />
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
