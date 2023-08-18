const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { User, Friend, Post, Comment } = require('../../db/models');
const { Op } = require('sequelize');

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

module.exports = router
