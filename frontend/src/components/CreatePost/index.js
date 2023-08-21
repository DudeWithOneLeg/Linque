import { useState } from 'react'
import * as postActions from '../../store/posts'
import { useDispatch } from 'react-redux'
import './index.css'

export default function CreatePost({ user }) {
    const [body, setBody] = useState("")
    const dispatch = useDispatch()

    const handleSubmit = () => {
        dispatch(postActions.createPost({body}))
        setBody("")
    }

    return (
        <div id='create-post'>

            <div id='create-post-input'>

                <img className='profile-image' src='https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=1024x1024&w=is&k=20&c=6XEZlH2FjqdpXUqjUK4y0LlWF6yViZVWn9HZJ-IR8gU=' />
                <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={`Whats on your mind ${user.firstName}?`}
                />

            </div>

            <button
            id='create-post-button'
            hidden={!body}
            onClick={handleSubmit}
            >
                Post
            </button>

            <div id='attachments'>

                <h2>
                    photo
                </h2>

                <h2>
                    event
                </h2>

            </div>

        </div>
    )
}
