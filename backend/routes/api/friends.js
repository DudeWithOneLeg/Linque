const express = require('express')
const { requireAuth } = require('../../utils/auth');
const { User, Friend, Post, Comment } = require('../../db/models');
const { Op } = require('sequelize');

const router = express.Router()

const friendsExist = async (req, res, next) => {

    const {id: userId} = req.user

    const friends = await Friend.findAll({
        where: {
            [Op.or]: [{fromUserId: userId}, {toUserId: userId}]
        },
        include: User
    })
    if (!friends) {
        res.status(404)
        res.json({
            message: "You dont have any friends"
        })
    }
    req.friends = friends
    return next()
}

router.get('/', [requireAuth, friendsExist], async (req, res) => {

    const { friends } = req

    res.status(200)
    return res.json(friends)
})

module.exports = router
