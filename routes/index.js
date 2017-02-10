var express = require('express')
var router = express.Router()

var firebase = require('firebase')

// Firebase configs
var configs = require('../configs.json')

firebase.initializeApp(configs.firebase)

/*
 *	Homepage routing etc
 */
router.get('/', (req, res) => {
	var user = firebase.auth().currentUser
	res.render('index', { user: user })
})


/*
 *	Chat page routing
 */
router.get('/chat/', (req, res) => {
	res.render('chat')
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
