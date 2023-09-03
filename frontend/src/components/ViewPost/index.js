import { useState } from 'react'
import ViewComments from '../ViewComments'
import * as postActions from '../../store/posts'
import { useDispatch } from 'react-redux'
import './index.css'

export default function ViewPost({ post, userId }) {

    const [edit, setEdit] = useState(false)
    const [body, setBody] = useState(post.body)

    const dispatch = useDispatch()

    return (
        <div className='view-post'>
            <div className='name-body'>
                <div className='post-header'>
                    <div className='post-user-info'>
                        <img className='profile-image' src='https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=1024x1024&w=is&k=20&c=6XEZlH2FjqdpXUqjUK4y0LlWF6yViZVWn9HZJ-IR8gU=' alt='profile'/>
                        <div>
                            <h3>{post.User.firstName} {post.User.lastName}</h3>
                            <p>{post.createdAt}</p>
                        </div>


                    </div>
                    {post.userId === userId && !edit && <img onClick={() => setEdit(true)} src='/images/edit.png' alt='edit' className='post-edit'/>}

                </div>
                <div className='post-body'>
                    {!edit && <p>{post && post.body}</p>}
                    {post.userId === userId && edit && <div className=''>
                        <textarea value={body} className='new-post' onChange={(e) => setBody(e.target.value)}/>
                        <button className='save-new-post' onClick={() => {
                            dispatch(postActions.updatePost(post.id, {body}))
                            setEdit(false)
                            }}>Save</button>
                        </div>}
                </div>
            </div>

            <div className='post-engagement'>

                    <p>num of likes</p>

                    <p>{post.Comments && post.Comments.length} comments</p>

            </div>
            <div className='post-like-button'>
                <img src='/images/like.png'/>
                <h3>Like</h3>
            </div>
            <ViewComments comments={post.Comments} postId={post.id}/>
        </div>
    )
}
