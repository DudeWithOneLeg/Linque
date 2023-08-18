const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { User, Friend, Post, Comment } = require('../../db/models');
const { Op } = require('sequelize');

const router = express.Router();

const validateFriends = async (req, res, next) => {

    if (req.err) return res.json(req.err)

    const { id: userId } = req.user

    const { userId: friendId } = req.params

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

//Get current users posts
router.get('/', [requireAuth], async (req, res) => {

    const { id: userId } = req.user

    const posts = await User.findOne({
        where: {
            id: userId
        },
        include: [
            {
                model: Post,
                include: [
                    User,
                    {
                        model: Comment,
                        include: [User]
                    }
                ]
            }
        ]
    })

    if (posts) {
        res.status(200)
        res.json(posts)
    }

})
router.get('/comments', [requireAuth], async (req, res) => {
    const {id: userId} = req.user

    const comments = await Comment.findAll({
        where: {
            userId: userId,

        },
        include: [
                {
                    model: Post,
                    include: User
                }
            ]
    })
    res.status(200)
    res.json(comments)
})

//Get profile of a friend
router.get('/:userId', [requireAuth, validateFriends], async (req, res) => {

    const { id: userId } = req.user

    const posts = await User.findOne({
        where: {
            id: userId
        },
        include: [
            {
                model: Post,
                include: [
                    User,
                    {
                        model: Comment,
                        include: [User]
                    }
                ]
            }
        ]
    })

    if (posts) {
        res.status(200)
        res.json(posts)
    }

})


module.exports = router
