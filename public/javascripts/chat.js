/* eslint-disable */
window.onload = () => {
	var messages = []
	var socket = io.connect('localhost:3000')

	socket.on('message', (data) => {
		if(data.message) {
			messages.push(data.message)
			alert(messages)
			var html = ''
			for (var i=0; i<messages.length; i++) {
				html += messages[i] + '<br/>'
			}
			$('.convo').innerHTML = html
		} else {
			console.log('There was a problem: ', data)
		}
	})

	$('form').submit( (e) => {
		e.preventDefault()
		var msg = $('.input').val()
		socket.emit('send', { messages: msg })
		alert(msg)
		$('.input').val('')
	})
}
/* eslint-enable */
