import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import * as postsActions from '../../store/posts'
import ViewPost from "../ViewPost";
import './index.css'

export default function Feed() {

    const [posts, setPosts] = useState({})

    const dispatch = useDispatch()

    const sessionUser = useSelector(state => state.session.user)

    useEffect(() => {
        dispatch(postsActions.getAllPosts()).then(data => {
            if (data && !data.message) {
                setPosts(data)
            }
        })
    }, [dispatch])
    if (!sessionUser) return <Redirect to='/'/>




    return (
        <div id='feed'>
            {
                 Object.values(posts).length && !posts.message ? Object.values(posts).map(post => {
                    return <ViewPost post={post}/>
                }): posts.message
            }
        </div>
    )
}
