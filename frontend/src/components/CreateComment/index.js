import './index.css'

export default function CreateComment({ postId }) {

   

    return (
        <div className='create-comment'>
            <img className='profile-image' src='https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=1024x1024&w=is&k=20&c=6XEZlH2FjqdpXUqjUK4y0LlWF6yViZVWn9HZJ-IR8gU=' alt='profile' />
            <textarea />
            <img className='send-icon' src='/images/send.png' />
        </div>
    )
}
