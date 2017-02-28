var express = require('express');
var router = express.Router();

var firebase = require('firebase');

// Firebase configs
var configs = require('../configs.json');

firebase.initializeApp(configs.firebase);

var dbref = firebase.database().ref();

/**
 * Middleware to ensure only authenticated users can chat
 */
function isAuthenticated(req, res, next) {
  var user = firebase.auth().currentUser;
  if (user) return next();
  else res.redirect('/login');
}

/*
 *  Homepage routing etc
 */
router.get('/', (req, res) => {
  var user = firebase.auth().currentUser;
  res.render('index', { user: user });
});


/*
 *  Chat page routing
 *
 *  To require logging in, add isAuthenticated middleware
 *  between '/chat/' and (req, res)
 */
router.get('/chat/', isAuthenticated, (req, res) => {
  var user = firebase.auth().currentUser;

  console.log('Current user is ' + user.email);

  var nick = null;
  var chats = null;
  var rooms = null;
  
  dbref.once('value').then( (snapshot) => {

    // Try to set the nick and get user's rooms
    try {
      nick = snapshot.child('users/' + user.uid + '/nickname').val();
      rooms = snapshot.child('users/' + user.uid + '/rooms').val();
    } catch(e) {
      console.log('error: ' + e);
      console.log('defaulting to anon username');
      nick = 'anon';
      rooms = {global: 'global'};
    }

    // Then fetch chatdata
    chats = snapshot.child('chat').val();

    // Fetch the user's own chatrooms
    var chatrooms = {} ;
    for (var chat in chats) {
      for (var room in rooms) {
        if (chat === room) {
          chatrooms[chat] = chats[chat];
        }
      }
    }

    // Fetch public chatrooms
    var pub_rooms = {};
    for (var c in chats) {
      if (chats[c].public === true) {
        pub_rooms[c] = chats[c];
      }
    }

    res.render('chat', {
      'chats': chatrooms,
      'pubs': pub_rooms,
      'nickname': nick,
      'user': user
    });
  });
});


/*
 * Login page routing and handling
 */
router.get('/login/', (req, res) => {
  res.render('login');
});

// Handle logging in 
router.post('/login/', (req, res) => {

  firebase.auth().signInWithEmailAndPassword(
    req.body.email, 
    req.body.password)
    .then( () => {
      console.log('Sign in successful!');
      res.redirect('/chat');
    })
    .catch( (error) => {
      var ecode = error.code;
      var emsg = error.message;
      console.log('Error ' + ecode + ': ' + emsg);
    });
});

/*
 *  Hande logging out
 */
router.get('/logout/', (req, res) => {
  firebase.auth().signOut().then( () => {
    console.log('Successfully signed out');
    res.redirect('/');
  })
  .catch( (error) => {
    console.log('Error while signing out: ' + error);
    res.redirect('/');
  });
});


/*
 *  Handling registering
 */

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  firebase.auth().createUserWithEmailAndPassword(
    req.body.email, 
    req.body.password)
    .then( 
      u => {
        var updates = {};
        updates['users/' + u.uid + '/nickname'] = req.body.nick;
        updates['users/' + u.uid + '/rooms'] = { 'global': 'global' };
        firebase.database().ref().update(updates);
        console.log('Successfully created an account');
        res.redirect('/login');
      }, 
      error => {
        console.log('Couldn\'t register: ' + error.code + ': ' +  error.message);
      });
});

module.exports = router;
