const express = require('express')
const { requireAuth } = require('../../utils/auth');
const { User, Friend, Post, Comment } = require('../../db/models');
const { Op } = require('sequelize');
const friend = require('../../db/models/friend');

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
        },

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

router.get('/', [requireAuth], async (req, res) => {

    const { id: userId } = req.user

    const friends = await User.findByPk(userId, {
        include: [
            {
                model: Friend,
                as: 'friendshipsTo',
                include: [
                    {
                        model: User,
                        as: 'fromUser',
                    },
                ],
            },
            {
                model: Friend,
                as: 'friendshipsFrom',
                include: [
                    {
                        model: User,
                        as: 'toUser',
                    },
                ],
            },
        ],
    })


    if (!friends) {
        res.status(404)
        return res.json({
            message: 'You have no friends'
        })
    }

    const realFriends = friends.friendshipsFrom.concat(friends.friendshipsTo)

    res.status(200)
    return res.json(realFriends)
})

//Get friendship
router.get('/:userId', [requireAuth, userExists, validateFriends], async (req, res) => {

    const { friend } = req

    res.status(200)
    return res.json(friend)

})

//Update a friendship
router.put('/:friendshipId', [requireAuth], async (req, res) => {

    const { friendshipId } = req.params
    const { id: userId } = req.user

    const friendship = await Friend.findOne({
        where: {
            id: friendshipId
        }
    })

    console.log(friendship)

    if (!friendship) {
        res.status(404)
        return res.json({
            message: "This friend request does not exist"
        })
    }

    await friendship.update({
        status: 'friends'
    })

    res.status(200)
    return res.json(friendship)

})

router.post('/:friendId', [requireAuth], async (req, res) => {

    const { friendId } = req.params
    const { id: userId } = req.user




    const friendship = await Friend.create({
        toUserId: Number(friendId),
        fromUserId: userId,
        status: 'pending'
    })

    res.status(200)
    return res.json(friendship)

})

module.exports = router
