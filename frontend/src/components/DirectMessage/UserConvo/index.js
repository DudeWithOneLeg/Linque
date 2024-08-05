import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import * as messageActions from "../../../store/messages";
import { io } from "socket.io-client";
import Microphone from "../../Microphone";
import Messages from "../Messages";
import "./index.css";

// const NODE_ENV = process.env.NODE_ENV

export default function UserConvo({ selectedFriend, translate, showConvo }) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.session.user);
  const messages = useSelector((state) => state.message.allMessages);
  const speech = useSelector((state) => state.speech.speech);

  const socket = io("https://linque-m98u.onrender.com");

  // const socket = io('http://localhost:8000');

  const [message, setMessage] = useState({});
  const [body, setBody] = useState("");

  const friend = selectedFriend.toUser
    ? selectedFriend.toUser
    : selectedFriend.fromUser;
  const room = selectedFriend.id;

  const handleSubmit = async () => {
    const messageDiv = document.getElementById("user-conversation");
    console.log("this hit");
    const message = {
      body,
      room,
      senderId: user.id,
      convoId: selectedFriend.id,
      voice_id: user.voice_id,
      friendLanguage: friend.defaultLanguage,
      defaultLanguage: user.defaultLanguage,
      translate,
    };

    socket.emit("chat message", message);
    setBody("");

    // await dispatch(messageActions.setMessage({
    //     body: message.body,
    //     senderId: user.id,
    //     convoId: selectedFriend.id
    // }))
    messageDiv.scrollTop = messageDiv.scrollHeight;
  };

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("join room", { room });

      socket.on("chat message", (message) => {
        console.log(message);
        const messageDiv = document.getElementById("user-conversation");
        const newMessage = {
          body: message.body,
          senderId: message.senderId,
          convoId: message.convoId,
          language: message.language,
        };

        if (message.audio) {
          newMessage.audio = message.audio;
        }

        dispatch(messageActions.setMessage(newMessage));
        messageDiv.scrollTop = messageDiv.scrollHeight;
      });
    });
  }, []);

  useEffect(() => {
    dispatch(messageActions.getMessages(selectedFriend.id));
  }, [dispatch]);

  // useEffect(() => {
  //     if (showConvo && speech && speech.length) {
  //         setBody(speech)
  //         console.log('bodyyy',body)
  //     }
  // },[speech])

  return (
    <div id="user-convo">
      <div id="user-conversation">
        <Messages messages={messages} user={user}/>
      </div>
      <div id="dm-input-container">
        <textarea
          onChange={(e) => setBody(e.target.value)}
          id="dm-input"
          value={body}
        />
        {body && (
          <img
            src="/images/icons/send.png"
            onClick={handleSubmit}
            id="dm-send"
          />
        )}
        {/* <div><Microphone defaultLanguage={user.defaultLanguage}/></div> */}
      </div>
    </div>
  );
}
