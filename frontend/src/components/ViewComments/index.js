import './index.css'

export default function ViewComments({comments}) {
    return (
        <div className='view-comments'>
            {
                comments.length > 0 && comments.slice(0, 2).map(comment => {
                    return <div className='comment'>
                        <img className='profile-image' src='https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=1024x1024&w=is&k=20&c=6XEZlH2FjqdpXUqjUK4y0LlWF6yViZVWn9HZJ-IR8gU=' alt='profile'/>
                        <div className='comment-body'>
                            <h3 className='comment-user-info'>{comment.User.firstName} {comment.User.lastName}</h3>
                            <p className='comment-content'>{comment.body}</p>
                        </div>
                    </div>
                })
            }
        </div>
    )
}
