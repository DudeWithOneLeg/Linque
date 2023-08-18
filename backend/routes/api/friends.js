const express = require('express')
const { requireAuth } = require('../../utils/auth');
const { User, Friend, Post, Comment } = require('../../db/models');
const { Op } = require('sequelize');

const router = express.Router()

const userExists = async (req, res, next) => {

    const { userId } = req.params

    const user = await User.findByPk(userId)

    if (!user) {
        res.status(404)
        return res.json({
            message: "This user does not exist"
        })
    }
    return next()

}

const validateFriends = async (req, res, next) => {

    const { id: userId } = req.user

    const { userId: friendId } = req.params

    const friend = await Friend.findOne({
        where: {
            [Op.or]: [[{ toUserId: userId }, { fromUserId: friendId }], [{ toUserId: friendId }, { fromUserId: userId }]],
        }
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

//Get friendship
router.get('/:userId', [requireAuth, userExists, validateFriends], async (req, res) => {

    const { friend } = req

    res.status(200)
    return res.json(friend)

})

//NOT FINISHED!!!
////////////////////////////////////////////////////////////

//Update a friendship
router.put('/:friendsipId', [requireAuth, validateFriends], async (req, res) => {

    const { friendshipId } = req.params

    const friendship = await friendshipId.findByPk(friendshipId)

    await friendship.update({
        status: 'friends'
    })

    res.status(200)
    return res.json(friendship)

})

module.exports = router
