import * as commentActions from "../../../store/posts";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import "./index.css";

export default function CreateComment({ postId }) {
  const user = useSelector((state) => state.session.user);

  const dispatch = useDispatch();

  const [body, setBody] = useState("");

  const handleSubmit = () => {
    if (!body) return;
    dispatch(commentActions.createComment(postId, { body: body }));
    setBody("");
  };

  return (
    <div className="create-comment">
      <img
        className="profile-image"
        src={
          user.pfp
            ? user.pfp
            : "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=1024x1024&w=is&k=20&c=6XEZlH2FjqdpXUqjUK4y0LlWF6yViZVWn9HZJ-IR8gU="
        }
        alt="profile"
      />
      <textarea
        onChange={(e) => setBody(e.target.value)}
        value={body}
        placeholder="Add something to the conversation!"
      />
      {body && (
        <img
          className="send-icon"
          src="/images/icons/send.png"
          onClick={() => handleSubmit()}
        />
      )}
    </div>
  );
}
