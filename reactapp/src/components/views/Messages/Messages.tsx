import { useState, useEffect } from "react";
import PersonIcon from '@mui/icons-material/Person';
import { Avatar, Menu, MenuItem } from "@mui/joy";
import { server } from "../../../App";
import { formatChatTime, formatTime, getToken } from "../../api/Utils";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { Add } from "@mui/icons-material";
import { UserPropInterface } from "../../etc/UserPropInterface";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Picker from 'emoji-picker-react';
import EmojiFacesIcon from '@mui/icons-material/TagFaces';
import ImageIcon from '@mui/icons-material/Image';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';

export const MessagesView = ({ user }: UserPropInterface) => {
  document.title = "Messages";
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showChats, setShowChats] = useState(true);
  const [currentChat, setCurrentChat] = useState<any>('John Doe');
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isChatLoading, setChatLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setShowChats(true);
      } else {
        setIsMobile(false);
        setShowChats(false);
      }
    };

    const loadChats = async () => {
      const token = getToken();
      const response = await fetch(`${server}/messages/${token}/load`);
      const data = await response.json();
      setChats(data);
    }
    loadChats();

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openChat = async (chat: string) => {
    if (isChatLoading) return;
    setChatLoading(true);
    setCurrentChat(chat);
    const token = getToken();
    const newChat = await fetch(`${server}/messages/${token}/new/${chat}`, {
      method: 'POST'
    });
    const data = await newChat.json();
    const newData = data.sort((a: any, b: any) => new Date(a.send).getTime() - new Date(b.send).getTime());
    if (newData) {
      setMessages(newData);
    }

    setChatLoading(false);
    if (isMobile) setShowChats(false);
  };


  const sendMessage = async (e: any) => {
    e.preventDefault();
    if (newMessage.trim().replace(" ", "").length <= 0) return;
    setMessages([...messages, { text: newMessage, sender: user.userName, send: new Date() }]);
    const token = getToken();
    try {
      const response = await fetch(`${server}/messages/${token}/${currentChat}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: newMessage
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add chat message');
      }
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


  return (
    <div className="flex h-screen">
      {!isMobile || (isMobile && showChats) ? (
        <div className="w-full md:w-1/4 shadow-lg">
          <div className="py-4 px-6">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Chats
            </h1>
          </div>
          <div
            className="flex flex-col space-y-2 p-4 overflow-auto"
            style={{ maxHeight: "calc(100vh - 10rem)" }}
          >
            {chats.map((chat: any, index) => (
              <button
                key={index}
                onClick={() => navigate(`/messages/${chat.name}`)}
                className={`flex gap-4 w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-white ${currentChat === chat.name ? "bg-gray-200 dark:bg-gray-600 rounded-md" : ""
                  } transform active:scale-95 transition duration-200`}
              >
                <Avatar className="w-14 h-14 border transform active:scale-90 transition duration-200">
                  <PersonIcon />
                </Avatar>
                <div className="grid gap-1">
                  <h3 className="font-semibold dark:text-gray-200">{chat.name}</h3>
                  <h3 className="font-semibold dark:text-gray-200">Zuletzt online {formatChatTime(new Date(chat.lastOnline))}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <Routes>
        <Route
          path=":target/*"
          element={
            <Chat
              openChat={openChat}
              isMobile={isMobile}
              showChats={showChats}
              currentChat={currentChat}
              messages={messages}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              sendMessage={sendMessage}
              setMessages={setMessages}
              setShowChats={setShowChats}
              user={user}
            />
          }
        />
      </Routes>
    </div>
  );
}


const Chat = ({ openChat, isMobile, showChats, currentChat, messages, setMessages, newMessage, setNewMessage, sendMessage, setShowChats, user }: any) => {
  document.title = currentChat + " - Messages"
  const { target } = useParams();

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPickers, setShowPickers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    openChat(target);
  }, [openChat, target]);

  const onEmojiClick = (event: any, emojiObject: any) => {
    setNewMessage(newMessage + event.emoji);
    setShowEmojiPicker(false);
  };

  const onImageUpload = (event: any) => {
    // handleImageUpload(event.target.files[0]);
    event.target.value = '';
  };

  const togglePicker = (index: any) => {
    const updatedPickers: any = [...showPickers];
    updatedPickers[index] = !updatedPickers[index];
    setShowPickers(updatedPickers);
  };

  return (
    <>
      {!isMobile || (isMobile && !showChats) ? (
        <div className="w-full md:w-3/4 no-scr">
          {isMobile ? (
            <button
              onClick={() => navigate("/messages")}
              className="md:hidden block dark:text-white p-1 rounded mt-2 ml-2"
            >
              <ArrowBackIcon />
            </button>
          ) : null}
          <div className="py-4 px-6">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">{currentChat}</h1>
          </div>
          <div className="flex flex-col space-y-4 p-6 h-3/4 overflow-auto">
            {messages.map((message: any, index: any) => (
              <div key={index}>
                <Message
                  user={user}
                  message={message}
                  togglePicker={togglePicker}
                  showPickers={showPickers}
                  messages={messages}
                  setMessages={setMessages}
                  index={index}
                  chat={target}
                />
              </div>
            ))}
          </div>
          <form
            onSubmit={sendMessage}
            className="m-6 flex shadow-lg rounded-lg"
            style={{ position: "sticky", bottom: 0 }}
          >
            <input
              type="text"
              value={newMessage}
              onChange={(event) => setNewMessage(event.target.value)}
              placeholder="Type a message..."
              aria-label="Message"
              className="dark:bg-gray-900 bg-white block w-full rounded-full border border-neutral-300 bg-transparent py-4 pl-6 pr-20 text-base/6 text-neutral-950 ring-4 ring-transparent transition placeholder:text-neutral-500 focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5 dark:placeholder:text-white dark:text-white dark:focus:dark:border-blue-700"
            />
            {showEmojiPicker ? (
              <div className="absolute bottom-14 right-0 md:right-3">
                <Picker onEmojiClick={onEmojiClick} />
              </div>
            ) : null}
            <div className="m-4 absolute inset-y-0 flex items-center right-4">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-neutral-950 text-white transition hover:bg-neutral-800 dark:bg-blue-700 dark:hover:bg-blue-900 mr-3"
              >
                <EmojiFacesIcon fontSize="small" />
              </button>
              <label htmlFor="image-upload" className="h-8 w-8 flex items-center justify-center rounded-full bg-neutral-950 text-white transition hover:bg-neutral-800 dark:bg-blue-700 dark:hover:bg-blue-900 mr-3">
                <ImageIcon fontSize="small" />
              </label>
              <input
                type="file"
                id="image-upload"
                style={{ display: 'none' }}
                onChange={onImageUpload}
              />
              <button
                type="submit"
                aria-label="Submit"
                className="h-8 w-8 flex items-center justify-center rounded-full bg-neutral-950 text-white transition hover:bg-neutral-800 dark:bg-blue-700 dark:hover:bg-blue-900"
              >
                <svg viewBox="0 0 16 6" aria-hidden="true" className="w-4">
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16 3 10 .5v2H0v1h10v2L16 3Z"
                  ></path>
                </svg>
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  )
}

const Message = ({ chat, user, message, setMessages, messages, index, togglePicker, showPickers }: any) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [reactions, setReactions] = useState<any[]>([]);

  const [isOutfit, setIsOutfit] = useState(false);
  const [outfit, setOutfit] = useState('');

  useEffect(() => {
    setReactions(message.reactions);
    if (message.text.includes("[sharedOutfit=")) {
      var sharedOutfitId = message.text.match(/(?<=\[sharedOutfit=)[^\]]+/);
      setOutfit(sharedOutfitId);
      setIsOutfit(true);
    }
  }, [message])

  const handleClick = (event: any) => {
    if (anchorEl === null) {
      setAnchorEl(event.currentTarget);
    } else {
      setAnchorEl(null);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleClose();
    const token = getToken();
    const msgs = messages.filter((m: any) => m.id !== message.id);
    setMessages(msgs);
    fetch(`${server}/messages/${token}/${chat}/${message.id}/remove`, {
      method: 'DELETE'
    });
  }

  const handleReport = () => {
    handleClose();
  }

  const handleCopy = () => {
    handleClose();
    navigator.clipboard.writeText(message.text);
  }

  const handleAddEmoji = (event: any) => {
    var remove = false;
    reactions.forEach(reaction => {
      if (reaction === event.emoji) {
        remove = true;
      }
    });
    
    const newReactions: any = [...(reactions || [])];
    if (remove) {
      newReactions.remove(event.emoji);
    } else {
      newReactions.push(event.emoji);
    }

    setReactions(newReactions);
  }

  return (
    <div key={index} className={`flex ${message.sender === user.userName ? 'items-end justify-end' : 'items-start justify-start'}`}>
      {isOutfit ? (
        <>
          <Link to={`/o/${outfit}`} className="inline-block bg-red-500 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ease-in-out min-w-[10%] max-w-xs">
            <ShareIcon />
            Shared Outfit
          </Link>
        </>
      ) : (
        <div className="max-w-xs bg-gray-300/60 dark:bg-blue-500 dark:text-white p-2 rounded-lg relative min-w-[20%]">
          <p>{message.text}</p>
          <span className="text-xs" title={formatTime(message.send)}>{formatChatTime(new Date(message.send))}</span>
          <button
            className="absolute bottom-0 right-0 mb-2 mr-2 w-6 h-6 flex items-center justify-center bg-blue-500 rounded-full text-white"
            onClick={() => togglePicker(index)}
          >
            <Add
              className="border border-1 rounded-3xl hover:scale-105 transition-all"
              style={{ width: '16px', height: '16px' }}
            />
          </button>
          {showPickers[index] && (
            <div className="absolute bottom-0 right-0 mb-10 mr-2">
              <Picker reactionsDefaultOpen={true} onReactionClick={handleAddEmoji} />
            </div>
          )}
        </div>
      )}
      <>
        <button className="focus:outline-none dark:text-gray-400" onClick={handleClick}>
          <MoreVertIcon />
        </button>

        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {message.sender === user.userName && (
            <MenuItem onClick={handleDelete}>Löschen</MenuItem>
          )}
          <MenuItem onClick={handleReport}>Melden</MenuItem>
          <MenuItem onClick={handleCopy}>Kopieren</MenuItem>
        </Menu>
      </>
      {reactions && reactions.map((reaction, index) => (
        <p key={index}>{reaction}</p>
      ))}
    </div>
  )
}