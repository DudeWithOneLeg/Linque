import './index.css'

export default function ViewPost({ post }) {
    return (
        <div class='view-post'>
            <div class='name-body'>
                <div>
                    <div class='post-user-info'>
                        <img class='profile-image' src='https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=1024x1024&w=is&k=20&c=6XEZlH2FjqdpXUqjUK4y0LlWF6yViZVWn9HZJ-IR8gU=' alt='profile'/>
                        <div>
                            <h3>{post.User.firstName} {post.User.lastName}</h3>
                            <p>{post.createdAt}</p>
                        </div>

                    </div>


                </div>
                <div class='post-body'>
                    {post.body && <p>{post.body}</p>}
                </div>
            </div>

            <div class='post-engagement'>
                <div>
                    <p>num of likes</p>
                </div>
                <div>
                    <p>{post.Comments && post.Comments.length} comments</p>
                </div>
            </div>
            <div>
                <h3>Like Button</h3>
            </div>
        </div>
    )
}
