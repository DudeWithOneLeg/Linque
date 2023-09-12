import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as commentActions from '../../store/posts'
import './index.css'

export default function ViewComment({ comment, userId }) {

    const dispatch = useDispatch()
    const [edit, setEdit] = useState(false)
    const [body, setBody] = useState(comment.body)
    const posts = useSelector(state => state.posts.allPosts)

    useEffect(() => {
        setBody(comment.body)
    },[posts])

    return (
        <div className='comment'>

            <img className='profile-image' src='https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=1024x1024&w=is&k=20&c=6XEZlH2FjqdpXUqjUK4y0LlWF6yViZVWn9HZJ-IR8gU=' alt='profile' />

            <div className='comment-body'>
                <div className='comment-container'>
                    <h3 className='comment-user-info'>{comment.User.firstName} {comment.User.lastName}</h3>
                    {
                        userId === comment.userId && <img className='comment-edit' src='/images/edit.png' onClick={() => setEdit(!edit)} alt='edit-comment'/>
                    }
                </div>
                {
                    !edit && <p className='comment-content'>{comment.body}</p>
                }
                {
                    edit && <div className='comment-edit-container'>
                        <textarea
                            className='comment-edit-text'
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                        <div className='comment-edit-buttons'>

                            <img
                                src='/images/save.png'
                                className='edit-send'
                                alt='send-edit'
                                onClick={() => { dispatch(commentActions.updateComment(comment.id, { body })); setEdit(false) }}
                            />
                            <img
                                src='/images/trash.png'
                                className='edit-delete'
                                alt='delete-post'
                                onClick={() => {dispatch(commentActions.deleteComment(comment)); setEdit(false); setBody(comment.body)}}
                            />
                        </div>
                    </div>
                }

            </div>
        </div>
    )
}
