const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { User, Friend, Post, Comment } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');
const { use } = require('./comments');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const isPostAuthor = (req, res, next) => {
    console.log(req.body)
    const { id: userId} = req.user
    const { post: {userId: authorId} } = req

    if (authorId !== userId) {
        res.status(403)
        return res.json({
            message: "You do not have permission to edit this post"
        })
    }
    return next()
}

const validateFriends = async (req, res, next) => {

    if (req.err) return res.json(req.err)

    const { id: userId } = req.user

    const { userId: friendId } = req.post

    if (userId === friendId) return next()

    const friend = await Friend.findOne({
        where: {
            [Op.or]: [[{toUserId: userId}, {fromUserId: friendId}], [{toUserId: friendId}, {fromUserId: userId}]],
            status: 'friends'
        }
    })

    if (!friend) {
        res.status(403)
        return res.json({
            message: "You must be friends with this user to see their posts."
        })
    }

    return next()

}

const postExists = async (req, res, next) => {
    console.log(req.body)
    const { postId } = req.params
    const post = await Post.findOne({
        where: {
            id: postId
        },
        include: [
            {
                model: Comment,
                include: User
            },
            User
        ]
    })


    if (post) {
        req.post = post
    }
    else {
        res.status(404)
        return res.json({
            message: "This post does not exist"
        })
    }
    return next()
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const router = express.Router();

//Create a post
router.post('/', [requireAuth], async (req, res) => {
    const user = req.user

    const { body } = req.body

    const post = await Post.create({
        userId: user.id,
        body,
    })

    const newPost = await Post.findOne({
        where: {
            id: post.id
        },
        include: [
            User,
            {
                model: Comment,
                include: [User]
            }
        ]
    })


    res.status(200)
    return res.json(newPost)

})

//Get post by ID if user is author or friend is author
router.get('/:postId', [requireAuth, postExists, validateFriends], async (req, res) => {

    const { post } = req

    res.status(200)

    return res.json(post)

})

//Update post if user is author
router.put('/:postId', [requireAuth, postExists, isPostAuthor], async (req, res) => {


    const { body } = req.body

    const { post: oldPost } = req

    const newPost = await oldPost.update({
        body
    })

    res.status(200)
    return res.json(newPost)

})

router.delete('/:postId', [requireAuth, postExists, isPostAuthor], async (req, res) => {

    const { post } = req

    await post.destroy()

    res.status(200)
    return res.json({
        message: "Success"
    })

})

router.get('/:postId/comments', [requireAuth, postExists, validateFriends], async (req, res) => {

    const { Comments } = req.post

    if (!Comments) {
        res.status(404)
        return res.json({
            message: 'This post has no comments yet.'
        })
    }

    return res.json(Comments)
})

router.post('/:postId/comments', [requireAuth, postExists, validateFriends], async (req, res) => {
    const { body } = req.body
    const {id: userId } = req.user
    const { postId } = req.params

    await Comment.create({
        body: body,
        userId: userId,
        postId: postId
    })

    const post = await Post.findOne({
        where: {
            id: postId
        },
        include: [
            {
                model: Comment,
                include: User
            },
            User
        ]
    })

    res.status(200)
    return res.json(post)

})

module.exports = router;
