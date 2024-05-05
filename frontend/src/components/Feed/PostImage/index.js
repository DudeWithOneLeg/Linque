import { useDispatch } from 'react-redux'
import * as postActions from '../../../store/posts'

export default function PostImage({post, setNewImage}) {
    const dispatch = useDispatch()

     return post && post.PostImage ? (
    <div
      id={post.PostImage.url}
      style={{ position: "relative" }}
      className="edit-post-image-container"
    >
      <img
        id={post.PostImage.url + "image"}
        src={post.PostImage.url}
        className="post-image edit-post-image"
        crossOrigin="anonymous"
        alt={post.PostImage.alt}
      />
      <img
        src="/images/icons/delete-image.png"
        id="delete-image-button"
        onClick={() => {
          dispatch(postActions.deleteImage(post.PostImage));
          setNewImage(null);
        }}
      />
    </div>
  ) : <></>
}
