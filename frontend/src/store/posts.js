import { csrfFetch } from './csrf'
export const flatten = (arr) => {

    const obj = {}
    for (let el of arr) {
        if (el.results) {
            console.log(el.results)
            el.data = JSON.parse(el.results)
        }
        obj[el.id] = el
    }
    return obj
}

const GET_ALL_POSTS = 'getPosts/all'
const GET_SINGLE_POST = 'getPosts/one'
const UPDATE_POST = 'post/update'
const DELETE_POST = 'post/delete'
const GET_FRIEND_POSTS = 'getPosts/friend'
const CREATE_POST = 'create/post'
const CREATE_POST_IMAGE = 'create/postImage'
const CREATE_POST_IMAGES = 'create/postImages'
const UPDATE_COMMENT = 'comment/update'
const DELETE_COMMENT = 'comment/delete'
const CREATE_COMMENT = 'create/comment'

const setNewComment = (comment) => {
    return {
        type: CREATE_COMMENT,
        payload: comment
    }
}

const setUpdateComment = (comment) => {
    return {
        type: UPDATE_COMMENT,
        payload: comment
    }
}

const setDeleteComment = (commentId) => {
    return {
        type: DELETE_COMMENT,
        payload: commentId
    }
}

const setPostImage = (data) => {
    return {
        type: CREATE_POST_IMAGES,
        payload: data
    }
}

const setAllPosts = (posts) => {
    return {
        type: GET_ALL_POSTS,
        payload: posts
    }
}

const setOnePost = (post) => {
    return {
        type: GET_SINGLE_POST,
        payload: post
    }
}

const setUpdatePost = (post) => {
    return {
        type: UPDATE_POST,
        payload: post
    }
}

const setDeletePost = (postId) => {
    return {
        type: DELETE_POST,
        payload: postId
    }
}

const setFriendPosts = (posts) => {
    return {
        type: GET_FRIEND_POSTS,
        payload: posts
    }
}

const setNewPost = (post) => {
    return {
        type: CREATE_POST,
        payload: post
    }
}

const setNewImage = (image) => {
    return {
        type: CREATE_POST_IMAGE,
        payload: image
    }
}

export const createComment = (postId, newComment) => async (dispatch) => {
    const res = await csrfFetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify(newComment)
    })
    const data = await res.json()
    if (data && !data.message) dispatch(setNewComment(data))
    return data
}

export const updateComment = (commentId, newComment) => async (dispatch) => {
    const res = await csrfFetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        body: JSON.stringify(newComment)
    })
    const data = await res.json()
    if (data && !data.message) dispatch(setNewPost(data))

    return res
}

export const deleteComment = (comment) => async (dispatch) => {
    const res = await csrfFetch(`/api/comments/${comment.id}`, {
        method: 'DELETE'
    })
    const data = await res.json()
    if (data && data.message) dispatch(setDeleteComment(comment))

    return res
}

export const uploadImage = (postId, image) => async (dispatch) => {
    const formData = new FormData();
    if (image.length) {
        for (let images of image) {
            formData.append('image', images)
        }

        console.log(image)

        const res = await csrfFetch(`/api/posts/images/${postId}`, {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
            },
            body: formData
        })
        const data = await res.json()
        if (data && !data.error) {
            console.log(data)
            return dispatch(setNewImage(data))
        }
        return
    }

    if (image) formData.append("image", image);
    const res = await csrfFetch(`/api/posts/${postId}/image`, {
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data",
        },
        body: formData,
    })
    const data = await res.json();
    dispatch(setNewImage(data));
}

export const getAllPosts = () => async (dispatch) => {
    const res = await csrfFetch('/api/feed')
    const data = await res.json()
    if (data && !data.message) dispatch(setAllPosts(flatten(data)))

    return flatten(data)
}

export const getOnePost = (postId) => async (dispatch) => {
    const res = await csrfFetch(`/api/posts/${postId}`)
    const data = await res.json()
    if (data && !data.message) dispatch(setOnePost(data))

    return res
}

export const updatePost = (postId, newPost) => async (dispatch) => {
    const res = await csrfFetch(`/api/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify(newPost)
    })
    const data = await res.json()
    if (data && !data.message) dispatch(setUpdatePost(data))

    return res
}

export const deletePost = (postId) => async (dispatch) => {
    const res = await csrfFetch(`/api/posts/${postId}`, {
        method: 'DELETE'
    })
    const data = await res.json()
    if (data && data.message) dispatch(setDeletePost(postId))

    return res
}

export const getFriendsPost = (userId) => async (dispatch) => {
    const res = await csrfFetch(`/api/friends/posts/${userId}`)
    const data = await res.json()
    if (data && !data.message) dispatch(setAllPosts(flatten(data)))

    return res
}

export const createPost = (newPost) => async (dispatch) => {
    const res = await csrfFetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify(newPost)
    })
    const data = await res.json()
    if (data && !data.message) dispatch(setNewPost(data))
    return data
}

const initialState = {}

export const postsReducer = (state = initialState, action) => {
    const currentState = { ...state }
    const currentPosts = { ...currentState.allPosts }
    switch (action.type) {
        case GET_ALL_POSTS:
            return { ...state, allPosts: { ...action.payload } }
        case GET_SINGLE_POST:
            return { ...state, singlePost: { ...action.payload } }
        case UPDATE_POST:
            const postId = action.payload.id
            currentPosts[postId] = { ...action.payload }
            return { ...currentState, allPosts: { ...currentPosts } }
        case DELETE_POST:
            const deleteId = action.payload
            delete currentPosts[deleteId]
            return { ...state, allPosts: { ...currentPosts } }
        case CREATE_POST:
            const createId = action.payload.id
            currentPosts[createId] = { ...action.payload }
            return { ...currentState, allPosts: { ...currentPosts } }
        case CREATE_POST_IMAGE:
            const imgPostId = action.payload.postId
            const imgPost = currentPosts[imgPostId]
            currentPosts[imgPostId] = { ...imgPost, PostImage: action.payload }
            return { ...currentState, allPosts: { ...currentPosts } }
        case UPDATE_COMMENT:
            const comment = action.payload
            const commentId = comment.id
            const post = currentPosts[comment.postId]
            post[commentId] = {...comment}
            currentPosts[post.id] = {...post}
            return { ...currentState, allPosts: { ...currentPosts } }
        case DELETE_COMMENT:
            const deletedComment = action.payload
            const deleteCommentId = deletedComment.id
            const deletedPost =  currentPosts[deletedComment.postId]
            const deletedComments = deletedPost.Comments
            delete deletedComments[deleteCommentId]
            deletedPost.Comments = {...deletedComments}
            currentPosts[deletedComment.postId] = deletedPost
            return { ...state, allPosts: { ...currentPosts } }
        case CREATE_COMMENT:
            const newComment = action.payload
            const id = newComment.id
            const newPost = currentPosts[newComment.postId]
            const comments = {...newPost.Comments}
            comments[id] = newComment
            newPost.Comments = {...comments}
            currentPosts[newPost.id] = {...newPost}
            return { ...currentState, allPosts: { ...currentPosts } }
        default:
            return state
    }
}
