import { useEffect, useState } from 'react'
import ViewComments from '../ViewComments'
import * as postActions from '../../store/posts'
import { useDispatch, useSelector } from 'react-redux'
import ViewObjects from '../ViewObjects'
import OpengraphReactComponent from 'opengraph-react'
import './index.css'

export default function ViewPost({ post, userId }) {

    const [edit, setEdit] = useState(false)
    const [body, setBody] = useState(post.body)
    const [newImage, setNewImage] = useState(null)

    const dispatch = useDispatch()

    const posts = useSelector(state => state.posts.allPosts)
    let createdAt = post.createdAt.split('T').join(' · ').slice(0, 18)
    let hour = createdAt.split(' · ')[1].split(':')[0]

    if (hour > 12 && !createdAt.includes('PM') && !createdAt.includes('AM')) {

        const oldHour = hour
        hour -= 12
        createdAt = createdAt.replace(oldHour, hour)
        createdAt += ' PM'
    }
    else if (hour < 12 && !createdAt.includes('AM') && !createdAt.includes('PM')) {

        createdAt += ' AM'
    }

    useEffect(() => {
        if (post.PostImage) {
            const newArr = []
            const imgDiv = document.getElementById(post.url)
            const img = document.getElementById(post.PostImage.url + 'image')

            img.onload = () => {
                if (post.PostImage) {
                    if (!post.PostImage.results) {

                        console.log('useEffect ran',post.PostImage.data)
                            const objects = JSON.parse(post.PostImage.data)
                            console.log(objects)
                            for (let object of objects) {
                                if (object.name !== 'Person') {
                                    console.log(object.name)
                                    const canvas = document.createElement('canvas')
                                    canvas.className = 'object-outline'

                                    const naturalWidth = img.naturalWidth
                                    const naturalHeight = img.naturalHeight

                                    //box size && position
                                    const left = object.data[0].x * naturalWidth
                                    const top = object.data[0].y * naturalHeight

                                    const width = (object.data[1].x * naturalWidth) - (object.data[0].x * naturalWidth)
                                    const height = (object.data[2].y * naturalHeight) - (object.data[0].y * naturalHeight)
                                    canvas.width = width
                                    canvas.height = height

                                    //drawing canvas and boxes
                                    const ctx = canvas.getContext("2d");

                                    // ctx.strokeRect(left, top, width, height)

                                    //extracting the cropped image
                                    ctx.drawImage(img, left, top, width, height, 0, 0, width, height)


                                    const croppedDataURL = canvas.toDataURL("image/png")
                                    function dataURLtoFile(dataurl, filename) {
                                        let arr = dataurl.split(','),
                                            mime = arr[0].match(/:(.*?);/)[1],
                                            bstr = atob(arr[arr.length - 1]),
                                            n = bstr.length,
                                            u8arr = new Uint8Array(n);
                                        while (n--) {
                                            u8arr[n] = bstr.charCodeAt(n);
                                        }
                                        return new File([u8arr], filename, { type: mime });
                                    }


                                    const file = dataURLtoFile(croppedDataURL, 'hello.png');



                                    newArr.push(file)
                                    console.log(object.name, croppedDataURL)
                                    //imgDiv.appendChild(canvas)
                                }




                            }

                            console.log('new array',newArr)
                            if (newArr.length) {

                                dispatch(postActions.uploadImage(post.id, newArr))
                            }

                    }




                }
            }
        }





    }, [posts])







    return (
        <div className='view-post'>
            <div className='name-body'>
                <div className='post-header'>
                    <div className='post-user-info'>
                        <img className='profile-image' src={post.User.pfp} alt='profile' />
                        <div>
                            <h3>{post.User.firstName} {post.User.lastName}</h3>
                            <p>{createdAt}</p>
                        </div>


                    </div>
                    {post.userId === userId && !edit && <img onClick={() => setEdit(true)} src='/images/icons/edit.png' alt='edit' className='post-edit' />}
                    {post.userId === userId && edit && <p onClick={() => {
                        setEdit(false)
                        if (!body && !post.PostImage) {
                            dispatch(postActions.deletePost(post.id))
                        }
                        }} className='post-edit-cancel'>Cancel</p>}

                </div>
                <div className='post-body'>

                    {!edit && post && <div>

                        <p>{post.body && post.body}</p>
                        {
                            post.hasImage && !post.PostImage && <img src='/images/icons/pic-loading.png' className='image-loading' alt='loading-picture'/>
                        }
                        {
                            post && post.PostImage && <div id={post.PostImage.url} style={{ position: 'relative' }}>
                                <img id={post.PostImage.url + 'image'} src={post.PostImage.url} className='post-image' crossOrigin='anonymous' alt={post.PostImage.alt}/>
                            </div>


                        }
                    </div>}
                    {post.userId === userId && edit && <div className='new-post-container'>
                        <textarea value={body} className='new-post' onChange={(e) => setBody(e.target.value)} ></textarea>

                        {
                            post && post.PostImage && <div id={post.PostImage.url} style={{ position: 'relative' }} className='edit-post-image-container'>
                                <img id={post.PostImage.url + 'image'} src={post.PostImage.url} className='post-image edit-post-image' crossOrigin='anonymous' alt={post.PostImage.alt}/>
                                <img src='/images/icons/delete-image.png' id='delete-image-button' onClick={() => {
                                    dispatch(postActions.deleteImage(post.PostImage))
                                    setNewImage(null)
                                    }}/>
                            </div>
                        }
                        {
                            post && edit && !post.PostImage && <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {setNewImage(e.target.files[0])}}
                        />
                        }
                        <div className='edit-post-buttons-container'>
                            <img
                                src='/images/icons/save.png'
                                className='edit-send'
                                alt='send-edit'
                                onClick={() => {
                                    dispatch(postActions.updatePost(post.id, { body }))
                                    if (newImage) {
                                        console.log(newImage)
                                        dispatch(postActions.uploadImage(post.id, newImage))
                                    }
                                    setEdit(false)
                                }}
                            />


                                <img
                                    src='/images/icons/trash.png'
                                    className='edit-delete'
                                    onClick={() => {
                                        dispatch(postActions.deletePost(post.id))

                                    }}
                                />

                        </div>
                    </div>}
                </div>

            </div>

            <div className='post-engagement'>

                {/* <p>num of likes</p> */}

                <p>{Object.values(post.Comments).length ? Object.values(post.Comments).length : '0'} comments</p>

            </div>
            {post.PostImage && post.PostImage.results && <div className='post-like-button'>
                {/* <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUXbmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXA%3D' target="_blank">

                    <img src='/images/like.png' />
                </a>

                <h3>Like</h3> */}

                <ViewObjects results={post.PostImage.results} />

            </div>}
            {
                post.PostImage && post.PostImage.data && !post.PostImage.results && <img src='/images/icons/loading.png' className='loading' />
            }
            <ViewComments comments={post.Comments} postId={post.id} key={post.id} userId={userId} />

        </div>
    )
}
