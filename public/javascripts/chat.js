/* eslint-disable */
window.onload = () => {
	var messages = []
	var socket = io.connect('localhost:3000')

	socket.on('message', (data) => {
		if(data.message) {
			messages.push(data.message)
			var html = ''
			for (var i=0; i<messages.length; i++) {
				html += messages[i] + '<br/>'
			}
			$('.convo').innerHTML = html
		} else {
			console.log('There was a problem: ', data)
		}
	})

	// When send button is clicked, emit the message
	$('form').submit( (e) => {
		e.preventDefault()
		var msg = $('.input').val()
		socket.emit('send', { message: msg })
		alert(msg)
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
