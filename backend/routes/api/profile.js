const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { User, Friend, Post, Comment, UserEvent } = require('../../db/models');
const { Op } = require('sequelize');

const router = express.Router();

const myFriendsExist = async (req, res, next) => {

    const { id: userId } = req.user

    const friends = await Friend.findAll({
        where: {
            [Op.or]: [{ fromUserId: userId }, { toUserId: userId }]
        },
        include: User
    })

    if (!friends) {
        res.status(404)
        res.json({
            message: "You dont have any friends."
        })
    }

    req.friends = friends
    return next()
}

//Get current users posts
router.get('/posts', [requireAuth], async (req, res) => {

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

    if (!posts) {
        res.status(404)
        return res.json({
            message: "You currently dont have any posts."
        })
    }

    res.status(200)
    return res.json(posts)

})

//Get current users friends
router.get('/friends', [requireAuth, myFriendsExist], async (req, res) => {

    const { friends } = req

    res.status(200)
    return res.json(friends)
})

//Get current users comments
router.get('/comments', [requireAuth], async (req, res) => {
    const { id: userId } = req.user

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

    if (!comments) {
        res.status(404)
        return res.json({
            message: "You havent made any comments."
        })
    }

    res.status(200)
    res.json(comments)
})

//Get current users Events
router.get('/events', [requireAuth], async (req, res) => {

    const { id: userId } = req.user

    const events = await UserEvent.findAll({
        where: {
            userId: userId
        }
    })

    if (!events) {
        res.status(404)
        return res.json({
            message: "You currently dont have any events."
        })
    }

    res.status(200)
    return res.json(events)

})

module.exports = router
