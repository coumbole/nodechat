/* eslint-disable */
window.onload = () => {

	/**
	 *	Holds the messages of a single session.
	 *	
	 *	TODO: 
	 *		- In the end of a session, push these
	 *			messages back to firebase.
	 */
	messages = []


	// Grab a socket instance to interact with the server
	var socket = io.connect('localhost:3000')
	
	/**
	 * Returns the message data in a form
	 * that can be rendered in the template
	 */
	function renderMsgHtml(data) {
		var html = '<div class="msg-container">'
		html += '<div class="msg">'
		html += '<div class="msg-author">'
		html += data.sender
		html += '</div>'
		html += '<div class="msg-content">'
		html += data.message
		html += '</div>'
		html += '<div class="msg-timestamp">'
		html += data.timestamp
		html += '</div></div></div>'
		return html
	}


	/**
	 * The socket reacts to a 'chatmessage' event.
	 * Then the data from the message is 
	 * parsed to the correct format (the same
	 * that is used in firebase).
	 */
	socket.on('chatmessage', (data) => {

		/**
		 * If the received data package contains
		 * a message, parse it to a suitable format
		 * and render it to the screen
		 *
		 * TODO:
		 *	- Add real timestamps to the messages
		 */ 
		if(data.message) {
			$('.convo').append(
				renderMsgHtml(data)
			)

			// When a mewssage is appended, scroll automatically down
			$('.convo').scrollTop($('.convo')[0].scrollHeight)


			messages.push(msgdata)

			/**
			 *	TODO:
			 *		- Actually push messages to firebase
			 */

			/**
			 * Get a new unique key for a new message
			 */
			//var newMessageKey = firebase.database().ref('chat/global').child('messages').push().key

			/**
			 * Create a new message object in the 
			 * correct firebase-friendly format
			 * using the msgdata-object created
			 * earlier.
			var newMsg = {
				newMessageKey: {
					msgdata
				}
			}
			 */

			/**
			 * New messages are stored in the
			 * messages-container, and only pushed
			 * to firebase when the session ends
			 */

		} else {
			console.log('There was a problem: ', data)
		}
	})

	/**
	 * When send button is clicked,
	 * emit the message to server
	 * and clear the input field
	 */
	$('form').submit( (e) => {
		e.preventDefault()
		var content = $('.input').val()
		socket.emit('chatmessage', {message: content} )
		$('.input').val('')
	})

	// Allow sending messages with enter
	$('.input').keypress( (e) => {
		if (e.which === 13) {
			$('form').submit()
			return false
		}
	} )
}
/* eslint-enable */
