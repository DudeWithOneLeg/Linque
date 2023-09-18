const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Post, Comment, Friend, UserEvent, PostImage } = require('../../db/models');
const { Op } = require('sequelize')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const FormData = require('form-data')
const axios = require('axios');
const fs = require('fs')
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const { singleMulterUpload, singlePublicFileUpload } = require('../awsS3')

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

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

router.get('/', [requireAuth], async (req, res) => {

    const {id: userId} = req.user

    const users = await User.findAll({
        include: [
            {
              model: Friend,
              as: 'friendshipsTo',
              include: [
                {
                  model: User,
                  as: 'fromUser',
                  where: {
                    id: userId
                  }
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
                  where: {
                    id: userId
                  }
                },
              ],
            },
          ],
    })
    res.status(200)
    return res.json(users)
})

router.post(
    '/',
    validateSignup,
    async (req, res) => {
        const { email, password, firstName, lastName, voice_id, googleAccId, pfp, defaultLanguage } = req.body;
        const hashedPassword = bcrypt.hashSync(password);
        const newUser = {
            email,
            hashedPassword,
            firstName,
            lastName,
        }

        if (voice_id) newUser.voice_id = voice_id
        if (googleAccId) newUser.googleAccId = googleAccId
        if (defaultLanguage) newUser.defaultLanguage = defaultLanguage
        if (pfp) newUser.pfp = pfp

        const user = await User.create(newUser);

        const safeUser = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            pfp: user.pfp,
            defaultLanguage: user.defaultLanguage
        };

        if (user.voice_id) safeUser.voice_id = user.voice_id

        console.log(safeUser)


        await setTokenCookie(res, safeUser);

        return res.json({
            user: safeUser
        });
    }
);

router.post('/voice', singleMulterUpload('file'), async (req, res) => {

    const file = req.file

    await writeFile('output.ogg', file.buffer)

    const form = new FormData()
    form.append('name', 'test')
    form.append('files', fs.createReadStream('output.ogg'), {
        filename: 'sample1.ogg',
        contentType: 'audio/ogg',
    })

    console.log('Fetching audio...')
    console.log(form.getHeaders())

    const API_ENDPOINT = 'https://api.elevenlabs.io/v1/voices/add'

    //Fetch voice
    await axios.post(`${API_ENDPOINT}`, form, {
        headers: {
            ...form.getHeaders(),
            'xi-api-key': ELEVENLABS_API_KEY
        }
    }).then(response => {
        if (response.data && response.data.voice_id) {
            res.status(200)
            return res.json(response.data)
        }

    })
        .catch(error => console.error(error)).catch(() => {
            console.log('FAILED :(')
        })


})

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
                    { model: User },
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

router.post('/:userId/image', [requireAuth, singleMulterUpload('image')], async (req, res) => {

    const image = req.file

    const { userId } = req.params

    const url = await singlePublicFileUpload(image)

    const user = await User.findByPk(userId)

    await user.update({
        pfp: url
    })

    res.status(200)
    return res.json({
        pfp: url
    })

})

module.exports = router
