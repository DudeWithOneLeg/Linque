const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { User, Friend, Post, Comment, PostImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');
const { use } = require('./comments');
const SerpApi = require('google-search-results-nodejs');
const { singleMulterUpload, singlePublicFileUpload, multiplePublicFileUpload, multipleMulterUpload } = require('../awsS3')
const vision = require('@google-cloud/vision');
const axios = require('axios');
const util = require('util')

const SERP_API_KEY = process.env.SERP_API_KEY;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const flatten = (arr) => {

    const obj = {}
    for (let el of arr) {
        if (el.results) {
            console.log(el.results)
            el.data = JSON.parse(el.results)
        }
        obj[el.id] = el
    }
    return obj
}

const isPostAuthor = (req, res, next) => {
    console.log(req.body)
    const { id: userId } = req.user
    const { post: { userId: authorId } } = req

    if (authorId !== userId) {
        res.status(403)
        return res.json({
            message: "You do not have permission to edit this post"
        })
    }
    return next()
}

async function detectObjects(url) {
    // Imports the Google Cloud client library
    const vision = require('@google-cloud/vision');

    // Creates a client
    const client = new vision.ImageAnnotatorClient();
    console.log(client)

    // Performs label detection on the image file
    const [result] = await client.objectLocalization(url);
    const objects = result.localizedObjectAnnotations;
    const arr = []
    objects.forEach(object => {
        const obj = {}
        obj.name = object.name
        obj.data = object.boundingPoly.normalizedVertices
        arr.push(obj)
    });
    return arr
}

const validateFriends = async (req, res, next) => {

    if (req.err) return res.json(req.err)

    const { id: userId } = req.user

    const { userId: friendId } = req.post

    if (userId === friendId) return next()

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

const postExists = async (req, res, next) => {
    console.log(req.body)
    const { postId } = req.params
    const post = await Post.findOne({
        where: {
            id: postId
        },
        include: [
            {
                model: Comment,
                include: User
            },
            User,
            { model: PostImage }
        ]
    })


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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const router = express.Router();

//Create a post
router.post('/', [requireAuth], async (req, res) => {
    const user = req.user
    const { body, hasImage } = req.body
    console.log('yoo has image ', hasImage)

    const post = await Post.create({
        userId: user.id,
        body,
        hasImage
    })

    const newPost = await Post.findOne({
        where: {
            id: post.id
        },
        include: [
            { model: User },
            {
                model: Comment,
                include: [User]
            },
            { model: PostImage }
        ]
    })



    console.log(post)
    res.status(200)
    return res.json(newPost)

})

//Get post by ID if user is author or friend is author
router.get('/:postId', [requireAuth, postExists, validateFriends], async (req, res) => {

    const { post } = req

    if (post.Comments) {
        post.Comments = flatten(post.Comments)
    }

    res.status(200)

    return res.json(post)

})

//Update post if user is author
router.put('/:postId', [requireAuth, postExists, isPostAuthor], async (req, res) => {


    const { body } = req.body

    const { post: oldPost } = req

    const comments = oldPost.Comments
    const user = oldPost.User
    const image = oldPost.PostImage

    await oldPost.destroy()



    const newPost = await Post.create({ id: oldPost.id, body: body, userId: oldPost.userId, hasImage: oldPost.hasImage })

    newPost.User = user
    newPost.Comments = comments

    console.log(newPost)

    if (newPost.Comments) {
        newPost.Comments = flatten(newPost.Comments)
    }

    res.status(200)
    return res.json({ ...newPost.dataValues, Comments: comments, User: user, PostImage: image})

})

router.delete('/:postId', [requireAuth, postExists, isPostAuthor], async (req, res) => {

    const { post } = req

    await post.destroy()

    res.status(200)
    return res.json({
        message: "Success"
    })

})

router.get('/:postId/comments', [requireAuth, postExists, validateFriends], async (req, res) => {

    const { Comments } = req.post

    if (!Comments) {
        res.status(404)
        return res.json({
            message: 'This post has no comments yet.'
        })
    }

    return res.json(Comments)
})

router.post('/:postId/comments', [requireAuth, postExists, validateFriends], async (req, res) => {
    const { body } = req.body
    const { id: userId } = req.user
    const { postId } = req.params

    const comment = await Comment.create({
        body: body,
        userId: userId,
        postId: postId
    })

    const newComment = await Comment.findOne({
        where: {
            id: comment.id
        },
        include: [User]
    })



    res.status(200)
    return res.json(newComment)

})

router.post('/:postId/image', [requireAuth, postExists, isPostAuthor, singleMulterUpload('image')], async (req, res) => {

    console.log(req.file)
    const url = await singlePublicFileUpload(req.file);
    const { postId } = req.params
    const { id: userId } = req.user
    let data = await detectObjects(url)

    const arr = []

    data.forEach(object => {
        if (object.name !== 'Person') arr.push(object)
    })

    const postImage = await PostImage.create({
        url, postId, userId, data: JSON.stringify(arr), results: null
    })
    res.status(200)
    console.log(postImage.dataValues)
    return res.json({ ...postImage.dataValues })

})

router.post('/images/:postId', [requireAuth, multipleMulterUpload('image')], async (req, res) => {

    const { postId } = req.params

    const image = await PostImage.findOne({
        where: {
            postId: postId
        }
    })

    if (image.data) {
        const data = JSON.parse(image.data)
        if (data.results && data.results.length) {


            return res.json({
                error: 'This image already has data'
            })
        }
    }

    const urls = await multiplePublicFileUpload(req.files)

    //temporary limit
    const obj = {}
    const imageData = JSON.parse(image.data)


    const func = async () => {
        return new Promise(async (resolve) => {
            if (urls.length) {


                for (let i = 0; i < urls.length; i++) {
                    const image = urls[i];
                    const itemIndex = urls.indexOf(image);
                    const search = new SerpApi.GoogleSearch(SERP_API_KEY);


                    let callback = async function (data) {
                        console.log(data)

                        if (data.search_metadata.status === 'Success') {

                            if (data.shopping_results && data.shopping_results.length) {
                                const matches = data.shopping_results.slice(0, 4);
                                obj[itemIndex] = { matches: matches, name: imageData[itemIndex].name, image: image };
                                console.log('callback', obj);
                            }
                            else if (data.visual_matches && data.visual_matches.length) {
                                const matches = data.visual_matches.slice(0, 4);
                                obj[itemIndex] = { matches: matches, name: imageData[itemIndex].name, image: image };
                                console.log('callback', obj);
                            }
                        }

                        if (i === urls.length - 1) {
                            console.log(urls, urls[i])
                            resolve(obj);
                        }
                    };

                    await search.json({ url: image, engine: 'google_lens' }, callback);



                }
            } else {
                resolve({});
            }
        }).catch((e) => console.log(e))
    };

    const results = await func()





    console.log('OBJECTS', results)

    // if (!results || !Object.values(results).length) {

    // }

    const newImage = await image.update({
        results: JSON.stringify(results)
    })

    console.log(newImage)
    res.status(200)
    return res.json(newImage)

})


module.exports = router;
