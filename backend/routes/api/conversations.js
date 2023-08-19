const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Message, User, UserConvo, Friend } = require('../../db/models')
const { Op } = require('sequelize')

const router = express.Router()

router.get('/', [requireAuth], async (req, res) => {

    const { id: userId } = req.user

    const friend = await User.findOne({
        where: {
            id: userId
        },
        include: [
            {
                model: Friend,
                where: {
                    [Op.or]: [[{ toUserId: userId }], [ { fromUserId: userId }]],
                    status: 'friends'
                },
                include: [
                    {
                        model: UserConvo,
                        include: Message
                    }
                ]
            }
        ]
    })

    res.status(200)
    return res.json(friend)

})

module.exports = router
