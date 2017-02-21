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
  $('#' + getCurrentRoom()).show()

  // Set the chat title accordingly
  $('#chatTitle').html(getCurrentRoom())

  // Holds the messages of the current session
  //var messages = {}

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
      $('#' + data.room).append(
        renderMsgHtml(data)
	    )
		  // When a mewssage is appended, scroll automatically down
      $('#' + data.room).scrollTop($('#' + data.room)[0].scrollHeight)
      //messages.push(data)
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
      "sender": user,
      "room": getCurrentRoom()
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
   *
   * When a user clicks a chatroom the user is first
   * unsubscribed from the previous chatroom, and is
   * then subscribed to a new one. Emitting the 
   * (un)subscribe message to server calls the
   * corresponding socket.leave/join methods 
   * on the server side.
   *
   * When a user clicks the chatroom button, also
   * highlight it and display the corresponding
   * messages.
   */
  $('.chat').not('#newchat').click( (e) => {

    //socket.emit('unsubscribe', getCurrentRoom())

    $('.selected').removeClass('selected')

    if ($(e.target).is('h4')) {
      $(e.target).parent().parent().addClass('selected')
    } else {
      $(e.target).addClass('selected')
    }

    $('#chatTitle').html(getCurrentRoom())
    $('.convo').hide()
    $('#' + getCurrentRoom()).show()
    //socket.emit('subscribe', getCurrentRoom() )
  })
}

/* eslint-enable */
