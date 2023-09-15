import { useEffect, useState } from 'react'
import ViewComments from '../ViewComments'
import * as postActions from '../../store/posts'
import { useDispatch, useSelector } from 'react-redux'
import ViewObjects from '../ViewObjects'
import './index.css'

export default function ViewPost({ post, userId }) {

    const [edit, setEdit] = useState(false)
    const [body, setBody] = useState(post.body)

    const dispatch = useDispatch()

    const posts = useSelector(state => state.posts.allPosts)

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

                            // console.log('new array',newArr)
                            // if (newArr.length) {

                            //     dispatch(postActions.uploadImage(post.id, newArr))
                            // }

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
                            <p>{post.createdAt}</p>
                        </div>


                    </div>
                    {post.userId === userId && <img onClick={() => setEdit(!edit)} src='/images/edit.png' alt='edit' className='post-edit' />}

                </div>
                <div className='post-body'>
                    {!edit && post && <div>
                        <p>{post.body && post.body}</p>
                        {
                            post.hasImage && !post.PostImage && <img src='/images/pic-loading.png' className='image-loading' alt='loading-picture'/>
                        }
                        {
                            post && post.PostImage && <div id={post.PostImage.url} style={{ position: 'relative' }}>
                                <img id={post.PostImage.url + 'image'} src={post.PostImage.url} className='post-image' crossOrigin='anonymous' alt='post'/>
                            </div>


                        }
                    </div>}
                    {post.userId === userId && edit && <div className=''>
                        <textarea value={body} className='new-post' onChange={(e) => setBody(e.target.value)} ></textarea>
                        <div className='edit-post-buttons-container'>
                            <img
                                src='/images/save.png'
                                className='edit-send'
                                alt='send-edit'
                                onClick={() => {
                                    dispatch(postActions.updatePost(post.id, { body }))
                                    setEdit(false)
                                }}
                            />


                                <img
                                    src='/images/trash.png'
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
            <ViewComments comments={post.Comments} postId={post.id} key={post.id} userId={userId} />
            {
                post.PostImage && post.PostImage.data && !post.PostImage.results && <img src='/images/loading.png' className='loading' />
            }

        </div>
    )
}
