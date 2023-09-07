import { useEffect, useState } from 'react'
import ViewComments from '../ViewComments'
import * as postActions from '../../store/posts'
import { useDispatch } from 'react-redux'
import './index.css'

export default function ViewPost({ post, userId }) {

    const [edit, setEdit] = useState(false)
    const [body, setBody] = useState(post.body)
    const [imageLoaded, setImageLoaded] = useState(false)

    const dispatch = useDispatch()




    useEffect(() => {
        if (post.url) {

            const imgDiv = document.getElementById(post.url)
            if (post.data) {

                if (post.data.length) {
                const objects = post.data
                for (let object of objects) {

                        console.log(object.data)

                        const canvas = document.createElement('canvas')

                        const left = object.data[0].x * canvas.width
                        const top = object.data[0].y * canvas.height

                        const width = object.data[1].x * canvas.width - object.data[0].x * canvas.width
                        const height = object.data[2].y * canvas.height - object.data[0].y * canvas.height

                        const ctx = canvas.getContext("2d");
                        ctx.strokeStyle = '#ff0000'
                        ctx.strokeRect(left, top, width, height);

                        const croppedDataURL = canvas.toDataURL("image/png")
                        console.log(croppedDataURL)

                        imgDiv.appendChild(canvas)
                    }


                }

            }
        }





    }, [])







    return (
        <div className='view-post'>
            <div className='name-body'>
                <div className='post-header'>
                    <div className='post-user-info'>
                        <img className='profile-image' src='https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=1024x1024&w=is&k=20&c=6XEZlH2FjqdpXUqjUK4y0LlWF6yViZVWn9HZJ-IR8gU=' alt='profile' />
                        <div>
                            <h3>{post.User.firstName} {post.User.lastName}</h3>
                            <p>{post.createdAt}</p>
                        </div>


                    </div>
                    {post.userId === userId && !edit && <img onClick={() => setEdit(true)} src='/images/edit.png' alt='edit' className='post-edit' />}

                </div>
                <div className='post-body'>
                    {!edit && post && <div>
                        <p>{post.body && post.body}</p>

                        {
                            post.url && post.data && <div id={post.url} style={{position: 'relative'}}>
                                <img src={post.url} className='post-image'/>
                            </div>


                        }
                    </div>}
                    {post.userId === userId && edit && <div className=''>
                        <textarea value={body} className='new-post' onChange={(e) => setBody(e.target.value)} />
                        <button className='save-new-post' onClick={() => {
                            dispatch(postActions.updatePost(post.id, { body }))
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
                <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUXbmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXA%3D' target="_blank">

                <img src='/images/like.png' />
                </a>

                <h3>Like</h3>
            </div>
            <ViewComments comments={post.Comments} postId={post.id} />
        </div>
    )
}
