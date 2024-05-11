import { languageCodesReversed } from "../../SignupForm/languages";

export default function Messages({ messages, user }) {
  return messages && Object.values(messages).length ? (
    Object.values(messages).map((message) => {
      if (message.senderId !== user.id) {
        // console.log(message.language);
        return (
          <div className="bot-message-container">
            <p className="user-message-language1">
              {message.language ? languageCodesReversed[message.language] : ""}
            </p>
            <div className="bot-message">
              {message.body}
              {message.audio ? (
                <audio src={message.audio} controls playbackRate={0.9} />
              ) : (
                <></>
              )}
            </div>
          </div>
        );
      } else {
        return (
          <div className="user-message-container">
            <p className="friend-message-language">
              {message.language ? languageCodesReversed[message.language] : ""}
            </p>
            <div className="user-message">
              {message.body}
              {message.audio ? (
                <audio src={message.audio} autoPlay controls />
              ) : (
                <></>
              )}
            </div>
          </div>
        );
      }
    })
  ) : (
    <></>
  );
}
