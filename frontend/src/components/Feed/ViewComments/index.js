import CreateComment from "../CreateComment";
import ViewComment from "../ViewComment";
// import OpengraphReactComponent from "opengraph-react";

import "./index.css";

export default function ViewComments({ comments, postId, userId }) {
  return (
    <div className="view-comments">
      <CreateComment postId={postId} key={postId} />
      {Object.values(comments).length ? (
        Object.values(comments).map((comment) => {
          return (
            <ViewComment comment={comment} userId={userId} key={comment.id} />
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
}
