

/**
* Returns the message data in a form
* that can be rendered in the template
*/
function renderMsgHtml(data) {
  var html = '<div class="msg-container">';
  html += '<div class="msg">';
  html += '<div class="msg-author">';
  html += data.nick;
  html += '</div>';
  html += '<div class="msg-content">';
  html += data.message;
  html += '</div>';
  html += '<div class="msg-timestamp">';
  html += data.timestamp;
  html += '</div></div></div>';
  return html;
}

/**
 * Figure out current chatroom
 */
function getCurrentRoom() {
  return $('.selected .chat-title h4').html();
}

/**
 * Renders the necessary html code for a
 * chatlist button
 */
function renderChat(name) {
  var chathtml = '';
  chathtml += '<div id="selectChat" class="chat">';
  chathtml += '<div class="chat-icon"></div>';
  chathtml += '<div class="chat-title">';
  chathtml += '<h4>';
  chathtml += name;
  chathtml += '</h4>';
  chathtml += '</div>';
  chathtml += '</div>';
  return chathtml;
}

/**
 * Renders the necessary html for when a new
 * chatroom is created.
 */
function renderConvo(title, msg) {
  var convohtml = '';
  convohtml += '<div style="display: none;" class="convo" id="' + title + '">';
  convohtml += '<div class="msg-container">';
  convohtml += '<div class="msg">';
  convohtml += '<div class="msg-author">';
  convohtml += msg.sender;
  convohtml += '</div>';
  convohtml += '<div class="msg-content">';
  convohtml += msg.content;
  convohtml += '</div>';
  convohtml += '<div class="msg-timestamp">';
  convohtml += msg.timestamp;
  convohtml += '</div>';
  convohtml += '</div>';
  convohtml += '</div>';
  convohtml += '</div>';
  return convohtml;
}

window.onload = () => {

  $('.container').attr('id', 'chat');

  //Default chatroom is the first one on the list
  $('.chat-list')
    .children('.chat')
    .not('#newchat, #joinChat')
    .first()
    .addClass('selected');
  $('#' + getCurrentRoom()).show();
  $('form.compose .input-container input.input').focus();

  // Set the chat title accordingly
  $('#chatTitle').html(getCurrentRoom());

  // Grab a socket instance to interact with the server
  /* eslint-disable */
  var socket = io.connect();

  // When the window is loaded and ready,
  // Join to all the user's rooms
  var rooms = [];
  for (var chat in chats) {
    rooms.push(chats[chat].title);
  }
  socket.emit('init', rooms);
  /* eslint-enable */


  /**
  * This function first creates the necessary
  * html for displaying the new chat on the
  * sidebar of the application. It then creates
  * a valid welcome message object as a preparative
  * measure before pushing the new chatroom to firebase.
  * Finally, a roomdata-object is created, which is then
  * emitted to the server, which creates a new chatroom node
  * on Firebase and pushes the room data and welcome message there.
  */
  /* eslint-disable */
  function createNewChat(name, welcomemsg) {
    var msg = {
      welcome: {
        content: welcomemsg,
        sender: 'Admin',
        room: name
      }
    };
    var roomdata = {
      title: name,
      messages: msg,
      public: false,
      admin: userid
    };
    /* eslint-enable */

    var chathtml = renderChat(name);
    var convohtml = renderConvo(name, msg.welcome);

    $('.chat-list').append(chathtml);
    $('.messages').append(convohtml);

    socket.emit('newroom', (roomdata));
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
    */
    if(data.message) {
      $('#' + data.room).append(
        renderMsgHtml(data)
      );
      // When a mewssage is appended, scroll automatically down
      $('#' + data.room).scrollTop($('#' + data.room)[0].scrollHeight);
    } else {
      console.log('There was a problem: ', data);
    }
  });


  /**
   * When send button is clicked,
   * emit the message to server
   * and clear the input field
   */
  /* eslint-disable */
  $('form').submit( (e) => {
    e.preventDefault();
    var content = $('#messageinput').val();
    var data = {
      'message': content,
      'nick': nick,
      'sender': userid,
      'room': getCurrentRoom()
    };
    socket.emit('chatmessage', data );
    $('#messageinput').val('');
  });
  /* eslint-enable */

  // Allow sending messages with enter
  $('#messageinput').keypress( (e) => {
    if (e.which === 13) {
      $('form').submit();
      return false;
    }
  });

  /**
   * Logic regarding the new chat button.
   */
  $('#newchat').click( () => {
    var name = prompt('Please choose a name for the chatroom');
    var message = 'Welcome to ' + name;
    if (name) {
      createNewChat(name, message);
    } else {
      alert('Chat creation failed');
    }
  });

  $('.public-chats').on('click', '.chat#joinChat', (e) => {
    var selected = $(e.target).text();
    var welcomemsg = {
      'sender': 'Admin',
      'content': 'Welcome to ' + selected,
      'room': selected
    };
    /* eslint-disable */
    var subsdata = {
      room: selected,
      uid: userid
    };
    /* eslint-enable */
    socket.emit('subscribe', subsdata);
    $('.chat-list').append(renderChat(selected));
    $('.messages').append(renderConvo(selected, welcomemsg));

  });

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
  $('.chat-list').on('click', '.chat:not(#newchat):not(#joinChat)', (e) => {
    $('.selected').removeClass('selected');
    if ($(e.target).is('h4')) {
      $(e.target).parent().parent().addClass('selected');
    } else {
      $(e.target).addClass('selected');
    }
    $('#chatTitle').html(getCurrentRoom());
    $('.convo').hide();
    $('#' + getCurrentRoom()).show();
  });
};

