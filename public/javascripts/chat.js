/* eslint-disable */


/**
* Returns the message data in a form
* that can be rendered in the template
*/
function renderMsgHtml(data) {
  var html = '<div class="msg-container">'
  html += '<div class="msg">'
  html += '<div class="msg-author">'
  html += data.nickname
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
 * Figure out current chatroom
 */
function getCurrentRoom() {
  return $('.selected .chat-title h4').html()
}

window.onload = () => {

  //Default chatroom is Global
  $('.chat:contains("global")').addClass('selected')

  // Set the chat title accordingly
  $('#chatTitle').html(getCurrentRoom())

	//Holds the messages of a single chat session.
  var messages = []

	// Grab a socket instance to interact with the server
  var socket = io.connect('localhost:3000')

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
	  */ 
    if(data.message) {
      $('.convo').append(
        renderMsgHtml(data)
	    )
		  // When a mewssage is appended, scroll automatically down
      $('.convo').scrollTop($('.convo')[0].scrollHeight)
      messages.push(data)
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
    var data = {
      "message": content,
      "nick": nick,
      "sender": user
    }
    socket.emit('chatmessage', data )
    $('.input').val('')
  })

	// Allow sending messages with enter
  $('.input').keypress( (e) => {
    if (e.which === 13) {
      $('form').submit()
      return false
    }
  })

  /**
   * Logic regarding the new chat button.
   *
   * TODO: 
   *  - Actually create a new chatroom
   */
  $('#newchat').click( (e) => {
    alert('create new chat')
  })

  /**
   * Allows the user to choose a chatroom to join
   * and chat in.
   */
  $('.chat').not('#newchat').click( (e) => {
    $('.selected').removeClass('selected')
    if ($(e.target).is('h4')) {
      $(e.target).parent().parent().addClass('selected')
    } else {
      $(e.target).addClass('selected')
    }
    $('#chatTitle').html(getCurrentRoom)
  })
}

/* eslint-enable */
