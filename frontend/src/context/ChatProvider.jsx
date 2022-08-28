import { useHistory } from "react-router-dom";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null
  );
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser("");
    history.push("/");
  };
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    if (!user) {
      history.push("/");
    } else {
      fetchChats();
      console.log("fect");
    }
  }, [history, fetchAgain]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        logout,
        setSelectedChat,
        selectedChat,
        chats,
        setChats,
        fetchAgain,
        setFetchAgain,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
