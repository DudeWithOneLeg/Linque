const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { User, Friend, Post } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')


const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
    const user = req.user
    const friends = await Friend.findAll({
        where: {
            [Op.or]: [{toUserId: user.id}, {fromUserId: user.id}],
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

    const posts = await Posts.findAll({
        where: {
            userId: {
                [Op.in]: friendsIds
            }
        }
    })

    res.status(200)
    res.json(posts)

})
