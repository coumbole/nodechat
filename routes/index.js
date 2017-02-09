var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Nodechat' });
});

router.get('/chat', (req, res, next) => {
	res.render('chat');
});

module.exports = router;
