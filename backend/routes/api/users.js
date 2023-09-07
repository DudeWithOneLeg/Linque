const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Post, Comment, Friend, UserEvent, PostImage } = require('../../db/models');
const { Op } = require('sequelize')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
    check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('Please provide your first name.'),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Please provide your last name.'),
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

const usersFriendsExist = async (req, res, next) => {

    const { userId } = req.params

    const friends = await Friend.findAll({
        where: {
            [Op.or]: [{ fromUserId: userId }, { toUserId: userId }],
            status: 'friends'
        },
        include: User
    })

    if (!friends) {
        res.status(404)
        res.json({
            message: "This user doesn't have any friends"
        })
    }

    req.friends = friends
    return next()
}

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

    if (req.err) return res.json(req.err)

    const { id: userId } = req.user

    const { userId: friendId } = req.params

    if (userId == friendId) return next()

    const friend = await Friend.findOne({
        where: {
            [Op.or]: [[{ toUserId: userId }, { fromUserId: friendId }], [{ toUserId: friendId }, { fromUserId: userId }]],
            status: 'friends'
        }
    })

    if (!friend) {
        res.status(403)
        return res.json({
            message: "You must be friends with this user to see their posts."
        })
    }

    return next()

}

const router = express.Router();

router.post(
    '/',
    validateSignup,
    async (req, res) => {
        const { email, password, username } = req.body;
        const hashedPassword = bcrypt.hashSync(password);
        const user = await User.create({ email, username, hashedPassword });

        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
        };

        await setTokenCookie(res, safeUser);

        return res.json({
            user: safeUser
        });
    }
);

//Get friends posts
router.get('/:userId/posts', [requireAuth, userExists, validateFriends], async (req, res) => {

    const { id: userId } = req.user

    const posts = await User.findOne({
        where: {
            id: userId
        },
        include: [
            {
                model: Post,
                include: [
                    {model: User},
                    {
                        model: Comment,
                        include: [User]
                    }
                ]
            }
        ]
    })

    if (!posts) {
        res.status(404)
        return res.json({
            message: "This user currently does not have any posts."
        })
    }

    res.status(200)
    return res.json(posts)

})

//Get friends of a friend
router.get('/:userId/friends', [requireAuth, userExists, validateFriends, usersFriendsExist], async (req, res) => {

    const { friends } = req

    res.status(200)
    return res.json(friends)

})

router.get('/:userId/comments', [requireAuth, userExists, validateFriends], async (req, res) => {

    const { userId } = req.params

    const comments = await Comment.findAll({
        where: {
            userId: userId,
        },
        include: [
            {
                model: Post,
                include: User
            },
            User
        ]
    })

    if (!comments) {
        res.status(404)
        return res.json({
            message: "This user currently does not have any comments."
        })
    }

    res.status(200)
    return res.json(comments)

})

//Get a users Events
router.get('/:userId/events', [requireAuth, validateFriends], async (req, res) => {

    const { userId } = req.params

    const events = await UserEvent.findAll({
        where: {
            userId: userId
        }
    })

    if (!events) {
        res.status(404)
        return res.json({
            message: "This user doesn't have any events."
        })
    }

    res.status(200)
    return res.json(events)

})

module.exports = router
