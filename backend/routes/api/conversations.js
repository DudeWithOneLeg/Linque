const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Message, User, UserConvo, Friend } = require('../../db/models')
const { Op } = require('sequelize')

const router = express.Router()

router.get('/:convoId', [requireAuth], async (req, res) => {

    const {convoId} = req.params

    const messages = await Message.findAll({
        where: {
            convoId
        }
    })

    const { id: userId } = req.user

    // const friend = await User.findOne({
    //     where: {
    //         id: userId
    //     },
    //     include: [
    //         {
    //             model: Friend,
    //             where: {
    //                 [Op.or]: [[{ toUserId: userId }], [ { fromUserId: userId }]],
    //                 status: 'friends'
    //             },
    //             include: [
    //                 {
    //                     model: UserConvo,
    //                     include: Message
    //                 }
    //             ]
    //         }
    //     ]
    // })
    console.log(messages)
    res.status(200)
    return res.json(messages)

})

module.exports = router
