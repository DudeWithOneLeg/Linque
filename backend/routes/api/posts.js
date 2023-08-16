const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { User, Friend, Post } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')



const validateFriends = async (userId, friendId) => {
    const friends = await Friend.findOne({
        where: {
            [Op.or]: [{toUserId: userId}, {fromUserId: friendId}, {toUserId: friendId}, {fromUserId: userId}],
            status: 'friends'
        }
    })
    console.log(friends)
    if (((friends.toUserId === userId && friends.fromUserId === friendId) || (friends.fromUserId === userId && friends.toUserId === friendId)) && friends.status === 'friends') {
        console.log('true')
        return true
    }
    else {
        console.log(false)
        return false
    }
}

// const postExists = async (req, res) {

// }

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
    const userid = req.user.id
    const friends = await Friend.findAll({
        where: {
            [Op.or]: [{ toUserId: userid }, { fromUserId: userid }],
            status: 'friends'
        }
    })
    const friendsIds = []
    friends.map((friend) => {
        if (friend.toUserId !== 1 && friend.fromUserId == 1 && !friendsIds.includes(friend.toUserId))
            return friendsIds.push(friend.toUserId)
        else if (friend.fromUserId !== 1 && friend.toUserId === 1 && !friendsIds.includes(friend.fromUserId)) {
            return friendsIds.push(friend.fromUserId)
        }
    })

    const posts = await Post.findAll({
        where: {
            userId: {
                [Op.in]: friendsIds
            }
        },
        include: [{ model: User }]
    })

    res.status(200)
    return res.json(posts)

})

router.post('/', requireAuth, async (req, res) => {
    const user = req.user

    const { body } = req.body

    const newPost = await Post.create({
        userId: user.id,
        body
    })

    res.status(200)
    return res.json(newPost)

})


router.get('/:postId', requireAuth, async (req, res) => {
    const userId = req.user.id
    const { postId } = req.params

    const post = await Post.findOne({
        where: {
            id: postId
        },
        include: {model: User}
    })

    if (!post) {
        res.status(404)
        return res.json({
            message: "This post does not exists"
        })
    }

    const poster = post.userId

    if (poster === userId) {
        res.status(200)
        res.json(post)
    }

    await validateFriends(userId, poster).then((reponses) => {
        if (reponses) {
            res.status(200)
            return res.json(post)
        }
    else if (!reponses) {
        res.status(403)
        res.json({
            message: "You must be friends with this user."
        })
    }
    })

})

router.put('/:postId', requireAuth, async (req, res) => {
    const user = req.user
    const { postId } = req.params
    const { body } = req.body

    const oldPost = await Post.findOne({
        where: {
            id: postId
        },
        incude: [{model: User}]
    })

    if (oldPost.userId !== user.id) {
        res.status(403)
        return res.json({
            message: "You dont have permission to edit this post."
        })
    }

    console.log(oldPost)

    const newPost = await oldPost.set({
        body
    })

    res.status(200)
    return res.json(newPost)

})

router.delete('/:postId', requireAuth, async (req, res) => {
    const user = req.user
    const { postId } = req.params

    const post = await Post.findOne({
        where: {
            id: postId
        },
        incude: [{model: User}]
    })

    if (post.userId !== user.id) {
        res.status(403)
        return res.json({
            message: "You dont have permission to edit this post."
        })
    }

    await post.destroy()

    res.status(200)
    return res.json({
        message: "Success"
    })

})

module.exports = router;
