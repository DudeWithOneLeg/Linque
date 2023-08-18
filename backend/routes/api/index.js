const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const feedRouter = require('./feed.js');
const postsRouter = require('./posts.js')
const commentsRouter = require('./comments.js')
const friendsRouter = require('./friends.js')
const profileRouter = require('./profile.js')
const eventsRouter = require('./events.js')

const { setTokenCookie } = require('../../utils/auth.js');
const { User } = require('../../db/models');
const { restoreUser } = require('../../utils/auth.js');
const { requireAuth } = require('../../utils/auth.js');

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/feed', feedRouter);

router.use('/posts', postsRouter)

router.use('/comments', commentsRouter)

router.use('/friends', friendsRouter)

router.use('/profile', profileRouter)

router.use('/events', eventsRouter)

router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Demo-lition'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});

router.get(
  '/restore-user',
  (req, res) => {
    return res.json(req.user);
  }
);

router.get(
  '/require-auth',
  requireAuth,
  (req, res) => {
    return res.json(req.user);
  }
);

module.exports = router;
