const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { User, Friend, Post, Comment } = require('../../db/models');

const router = express.Router()

const commentExists = async (req, res, next) => {
    const { commentId } = req.params
    const post = await Comment.findOne({
        where: {
            id: commentId
        },
        include: [
            {
                model: Post,
                include: User
            },
            User
        ]
    })

    console.log(post)
    if (post) {
        req.post = post
    }
    else {
        res.status(404)
        return res.json({
            message: "This post does not exist"
        })
    }
    return next()
}

router.get('/')

module.exports = router
