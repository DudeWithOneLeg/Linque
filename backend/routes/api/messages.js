const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Message, User, UserConvo, Friend } = require('../../db/models')
const { Op } = require('sequelize');
const { body } = require('express-validator');

const router = express.Router()

const validateFriends = async (req, res, next) => {

    const { id: userId } = req.user

    const { friendId } = req.params

    const friend = await Friend.findOne({
        where: {
            [Op.or]: [[{ toUserId: userId }, { fromUserId: friendId }], [{ toUserId: friendId }, { fromUserId: userId }]],
        },
        include: UserConvo
    })

    if (!friend) {
        res.status(403)
        return res.json({
            message: "You're not friends with this user'"
        })
    }

    req.friend = friend

    return next()

}

router.post('/:friendId', [requireAuth, validateFriends], async (req, res) => {

    const { friend } = req

    const { body } = req.body

    const { id: userId } = req.user

    if (!friend.UserConvo) {
        const newConvo = await UserConvo.create({
            friendshipId: friend.id
        })
        const newMessge = await Message.create({
            senderId: userId,
            convoId: newConvo.id,
            body: body
        })
        res.status(200)
        return res.json(newMessge)
    }

    const newMessge = await Message.create({
        senderId: userId,
        convoId: friend.UserConvo.id,
        body: body
    })

    res.status(200)
    return res.json(newMessge)

})

module.exports = router
