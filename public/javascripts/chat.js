/* eslint-disable */
window.onload = () => {

	/**
	 *	Holds the messages of a single session.
	 *	In the beginning of a session, the
	 *	messages from firebase are stored
	 *	into this, and all future messages
	 *	are appended in the end.
	 */
	messages = []


	var socket = io.connect('localhost:3000')
	
	function renderMsgHtml(data) {
		var html = '<div class="msg-container">'
		html += '<div class="msg">'
		html += '<div class="msg-author">'
		html += data.sender
		html += '</div>'
		html += '<div class="msg-content">'
		html += data.content
		html += '</div>'
		html += '<div class="msg-timestamp">'
		html += data.timestamp
		html += '</div></div></div>'
		return html
	}
	/**
	 * The socket reacts to a 'message' event.
	 * Then the data from the message is 
	 * parsed to the correct format (the same
	 * that is used in firebase). This is done,
	 * because when the session ends, all the
	 * messages are pushed to firebase.
	 */
	socket.on('chatmessage', (data) => {
		if(data.message) {
			var msgdata = {
					"sender"		: "anon",
					"content"		: data.message,
					"timestamp" : "080917-153923"
			}
			messages.push(msgdata)
			$('.convo').append(
				renderMsgHtml(msgdata)
			)
		} else {
			console.log('There was a problem: ', data)
		}
	})

	/**
	 * When send button is clicked,
	 * emit the message
	 */
	$('form').submit( (e) => {
		e.preventDefault()
		var msg = $('.input').val()
		socket.emit('chatmessage', { message: msg })
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
