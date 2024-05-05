import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import * as postsActions from "../../store/posts";
import ViewPost from "./ViewPost";
import CreatePost from "./CreatePost";
import "./index.css";

export default function Feed() {
  const [posts, setPosts] = useState({});
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const postsState = useSelector((state) => state.posts.allPosts);

  const newPosts = { ...postsState };

  useEffect(() => {
    dispatch(postsActions.getAllPosts()).then((data) => {
      if (data && !data.message) {
        setPosts(data);
      }
    });
  }, [dispatch]);

  return (
    <div id="feed">
      <CreatePost user={sessionUser} />
      {Object.values(newPosts).length && !posts.message
        ? Object.values(newPosts)
            .reverse()
            .map((post) => {
              return (
                <ViewPost
                  post={post}
                  userId={sessionUser.id}
                  key={post.id}
                  posts={postsState}
                />
              );
            })
        : posts.message}
    </div>
  );
}
