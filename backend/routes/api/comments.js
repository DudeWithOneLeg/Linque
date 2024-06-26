const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { User, Friend, Post, Comment, PostImage } = require('../../db/models');

const router = express.Router()

//Verify comment exists
const commentExists = async (req, res, next) => {
    const { commentId } = req.params
    const comment = await Comment.findOne({
        where: {
            id: commentId
        },
        include: [User]
    })

    // console.log(comment)
    if (comment) {
        req.comment = comment
    }
    else {
        res.status(404)
        return res.json({
            message: "This comment does not exist"
        })
    }
    return next()
}

const isCommentAuthor = (req, res, next) => {

    const { comment } = req
    const { id: userId } = req.user

    if (comment.userId === userId) return next()
    res.status(403)
    return res.json({
        message: "You dont have permission to edit this comment."
    })
}


router.put('/:commentId', [requireAuth, commentExists, isCommentAuthor], async (req, res) => {
    const { body } = req.body
    const { comment } = req

    const newComment = await comment.update({
        body
    })

    const comments = await Comment.findAll({
        where: {
            postId: comment.postId
        }
    })

    const post = await Post.findOne({
        where: {
            id: comment.postId
        },
        include: [
            {
                model: Comment,
                include: User
            },
            User,
            {
                model: PostImage
            }
        ]
    })
    // console.log(comments, post.Comments)
    const flatten = (arr) => {

        const obj = {}
        for (let el of arr) {

            obj[el.id] = el
        }
        return obj
    }

    // console.log(post)

    res.status(200)
    return res.json(post)
})

//Delete a comment
router.delete('/:commentId', [requireAuth, commentExists, isCommentAuthor], async (req, res) => {

    const { comment } = req

    await comment.destroy()

    res.status(200)
    res.json({
        message: "Success"
    })
})

//

module.exports = router
