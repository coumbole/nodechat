var express = require('express')
var router = express.Router()

var firebase = require('firebase')

// Firebase configs
var configs = require('../configs.json')

firebase.initializeApp(configs.firebase)

var db = firebase.database()
var chatref = db.ref('chat')
var globalchatref = chatref.child('global')


/**
 * Middleware to ensure only authenticated users can chat
 */
function isAuthenticated(req, res, next) {
	var user = firebase.auth().currentUser
	if (user) return next()
	else res.redirect('/login')
}

/*
 *	Homepage routing etc
 */
router.get('/', (req, res) => {
	var user = firebase.auth().currentUser
	res.render('index', { user: user })
})


/*
 *	Chat page routing
 *
 *	To require logging in, add isAuthenticated middleware
 *	between '/chat/' and (req, res)
 */
router.get('/chat/', isAuthenticated, (req, res) => {
	
	/**
	 * Once data is fetched, render the page and pass
	 * chatdata to the template
	 */
  chatref.once('value').then( (snapshot) => {
    var chats = snapshot.val()
    var global = snapshot.child('global').val()

    res.render('chat', {
      user: firebase.auth().currentUser,
      chatdata: global,
      chats: chats
    })
  })

})


/*
 * Login page routing and handling
 */
router.get('/login/', (req, res) => {
	res.render('login')
})

// Handle logging in 
router.post('/login/', (req, res) => {

	firebase.auth().signInWithEmailAndPassword(
		req.body.email, 
		req.body.password)
		.then( () => {
			console.log('Sign in successful!')
			res.redirect('/chat')
		})
		.catch( (error) => {
			var ecode = error.code
			var emsg = error.message
			console.log('Error ' + ecode + ': ' + emsg)
		})
})

/*
 *	Hande logging out
 */
router.get('/logout/', (req, res) => {
	firebase.auth().signOut().then( () => {
		console.log('Successfully signed out')
		res.redirect('/')
	})
	.catch( (error) => {
		console.log('Error while signing out: ' + error)
		res.redirect('/')
	})
})


/*
 *	Handling registering
 */

router.get('/register', (req, res) => {
	res.render('register')
})

module.exports = router
