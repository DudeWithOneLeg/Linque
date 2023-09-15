import { useState } from 'react'
import * as postActions from '../../store/posts'
import { useDispatch } from 'react-redux'
import './index.css'

export default function CreatePost({ user }) {
    const [body, setBody] = useState("")
    const [image, setImage] = useState(null)
    const [imageForm, setImageForm] = useState(false)
    const dispatch = useDispatch()

    const handleSubmit = () => {
        dispatch(postActions.createPost({body, hasImage: image ? true : false})).then(data => {
            if (image) {

                dispatch(postActions.uploadImage(data.id, image))
            }
        })

        setBody("")
        setImage('')
        setImageForm(false)
    }

    return (
        <div id='create-post'>

            <div id='create-post-input'>

                <img className='profile-image' src={user.pfp} alt='profile'/>
                <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={`Whats on your mind ${user.firstName}?`}
                />

            </div>

            <button
            id='create-post-button'
            hidden={!body && !image}
            onClick={handleSubmit}
            >
                Post
            </button>

            <div id='attachments'>

                {!imageForm && <h2 onClick={() => setImageForm(true)}>
                    Photo
                </h2>}
                {
                    imageForm && <div id='image-container'>
                        <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {setImage(e.target.files[0])}}
                />
                    </div>
                }

                <h2>
                    Event
                </h2>

            </div>

        </div>
    )
}
