import * as commentActions from '../../store/posts'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import './index.css'

export default function CreateComment({ postId }) {

    const dispatch = useDispatch()

    const [body, setBody] = useState('')

    const handleSubmit = () => {
        dispatch(commentActions.createComment(postId, {body: body}))
        setBody('')
    }

    return (
        <div className='create-comment'>
            <img className='profile-image' src='https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=1024x1024&w=is&k=20&c=6XEZlH2FjqdpXUqjUK4y0LlWF6yViZVWn9HZJ-IR8gU=' alt='profile' />
            <textarea
                onChange={(e) => setBody(e.target.value)}
                value={body}
            />
            <img className='send-icon' src='/images/send.png' onClick={() => handleSubmit()}/>
        </div>
    )
}
