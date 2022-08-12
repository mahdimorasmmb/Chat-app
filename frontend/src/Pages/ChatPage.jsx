import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

function ChatPage() {
  const [loding, setLoding] = useState(false);
  const [chats, setChats] = useState([]);

  const fetchCats = async () => {
    setLoding(true);
    const { data } = await axios.get("/api/chat");
    setChats(data);
    setLoding(false);
  };

  useEffect(() => {
    fetchCats();
  }, []);
  return (
    <div>
      {loding ? (
        <h1>Loding Chats</h1>
      ) : (
        chats.map((chat) => <div key={chat._id}>{chat.chatName}</div>)
      )}
    </div>
  );
}

export default ChatPage;
