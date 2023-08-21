import ViewComments from '../ViewComments'
import './index.css'

export default function ViewPost({ post, userId }) {

    return (
        <div className='view-post'>
            <div className='name-body'>
                <div className='post-header'>
                    <div className='post-user-info'>
                        <img className='profile-image' src='https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=1024x1024&w=is&k=20&c=6XEZlH2FjqdpXUqjUK4y0LlWF6yViZVWn9HZJ-IR8gU=' alt='profile'/>
                        <div>
                            <h3>{post.User && post.User.firstName} {post && post.User.lastName}</h3>
                            <p>{post && post.createdAt}</p>
                        </div>


                    </div>
                    {post && post.userId === userId && <img src='/images/edit.png' alt='edit' className='post-edit'/>}

                </div>
                <div className='post-body'>
                    {post && post.body && <p>{post && post.body}</p>}
                </div>
            </div>

            <div className='post-engagement'>

                    <p>num of likes</p>

                    <p>{post && post.Comments && post.Comments.length} comments</p>

            </div>
            <div className='post-like-button'>
                <img src='/images/like.png'/>
                <h3>Like</h3>
            </div>
            <ViewComments comments={post.Comments}/>
        </div>
    )
}
