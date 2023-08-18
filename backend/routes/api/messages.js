const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Message, User } = require('../../db/models')
const { Op } = require('sequelize')

const router = express.Router()

router.get('/', [requireAuth], async (req, res) => {

    const { id: userId } = req.user

    const messages = await Message.findAll({
        where: {
            [Op.or]: [{senderId: userId}, {receiverId: userId}]
        },
        include: User
    })

    if (!messages) {
        res.status(404)
        return res.json({
            message: "You dont have any messages"
        })
    }
    console.log(messages)

    res.status(200)
    return res.json(messages)

})

module.exports = router
