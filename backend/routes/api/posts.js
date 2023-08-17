const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { User, Friend, Post, Comment } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const isPostAuthor = (req, res, next) => {
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



    const comments = await Comment.findAll({
        where: {
            postId: postId
        },
        include: [{model: User}]
    })
    console.log(comments)
    console.log(post)
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

//Get all posts only if friends
router.get('/', requireAuth, async (req, res) => {

    const userid = req.user.id

    const friends = await Friend.findAll({
        where: {
            [Op.or]: [{ toUserId: userid }, { fromUserId: userid }],
            status: 'friends'
        }
    })

    const friendsIds = [userid]

    friends.map((friend) => {

        if (friend.toUserId !== userid && friend.fromUserId == userid && !friendsIds.includes(friend.toUserId) && friend.status === 'friends')
            return friendsIds.push(friend.toUserId)
        else if (friend.fromUserId !== userid && friend.toUserId === userid && !friendsIds.includes(friend.fromUserId) && friend.status === 'friends') {
            return friendsIds.push(friend.fromUserId)
        }
    })

    const posts = await Post.findAll({
        where: {
            userId: {
                [Op.in]: friendsIds
            }
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
    return res.json(posts)

})

router.get('/my-posts', requireAuth, async (req, res) => {

    const {id: userId } = req.user

    const posts = await Post.findAll({
        where: {
            userId: userId
        },
        include: [
            {
                model: Comment,
                include: User
            },
            {
                model: User
            }
        ]
    })

    if (!posts) {
        res.status(404)
        return res.json({
            message: "You dont have any posts."
        })
    }

    res.status(200)
    return res.json(posts)
})

//Create a post
router.post('/', [requireAuth], async (req, res) => {
    const user = req.user

    const { body } = req.body

    const newPost = await Post.create({
        userId: user.id,
        body
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

router.get('/:postId/comments', [requireAuth, postExists], async (req, res) => {
    res.status(200)
    return res.json(req.post.Comments)
})

module.exports = router;
