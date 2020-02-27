const express = require('express');
const router = express.Router();

router.use('/posts', require('./post.routes'));
router.use('/columns', require('./column.routes'));

module.exports = router;