$(window).ready( () => {

  /* eslint-disable */
  var socket = io.connect();
  /* eslint-enable */

  /**
   * When the site is loaded, hide the settings
   * panels.
   */ 
  $('.settings').hide();

  /* eslint-disable */
  $('#nickfield').val(nick);
  /* eslint-enable */

  /**
   * Opens up on of the two settings panels.
   * One is used for user's settings, other one
   * for chat settings
   */
  $('i.fa-bars').click( (e) => {
    $(e.target).closest('header').siblings('.settings').toggle();
  });

  // Close the panel
  $('.closebtn').click( (e) => {
    $(e.target).closest('.settings').hide();
  });

  // Enable editing of the nickname field
  $('#editnick').click( () => {
    $('#nickfield').attr('readonly', false);
    $('#nickfield').focus();
  });
  
  // When the client's focus is out of the
  // nickname field, send the data to server
  // and change the nickname
  /* eslint-disable */
  $('#nickfield').focusout( () => {
    $('#nickfield').attr('readonly', true);
    var newnick = $('#nickfield').val();
    if (newnick == '') {
      alert('Nickname cannot be empty');
      $('#nickfield').val(nick);
    } else {
      // the nick variable is defined in chat.pug
      nick = newnick;
      var data = {
        nick: newnick,
        userid: user.uid,
        currentroom: $('.selected').text()
      };
      socket.emit('updatenick', (data));
    }
  });
  /* eslint-enable */

  // Show the search panel when input field is focused
  $('#searchfield').focus(() => {
    $('.public-chats').show();
  });

  // Hide the search panel when input field is out of focus
  $('#searchfield').focusout( () => {
    $('.public-chats').hide();
  });

  /**
   * When the user types something to the search field,
   * Search for public chatrooms in real time and display
   * the results.
   */
  var data;
  $('#searchfield').on('keyup', (e) => {
    var value = e.target.value.toLowerCase();
    if (value === '') $('.public-chats').append(data);
    $('.public-chats .chat').each( (i, v) => {
      $(v).toggle( $(v).text().toLowerCase().indexOf(value) !== -1 );
    });
  });

  /**
   * When the red leave chat -button is clicked,
   * delete the room from the chat list, and delete
   * the message container as well. 
   *
   * Then send the unsubsribe event to the server,
   * which then removes the room from the user's
   * subscribed rooms list.
   *
   * Finally, set another chat as the selected one.
   */
  $('#leavechat').click( () => {
    var currentroom = $('.selected').text();

    /* eslint-disable */
    var roomdata = {
      room: currentroom,
      userid: user.uid,
      nick: nick
    };
    /* eslint-enable */

    // Send the unsubscribe event to server
    socket.emit('unsubscribe', (roomdata));

    // Remove the chatlist name and message container
    $('.selected, #' + currentroom).remove();

    // Add selected class to the first chat on the list
    $('.chat-list')
      .children('.chat')
      .not('#newchat, #joinChat')
      .first()
      .addClass('selected');

    // Get the new room
    var theRoom = $('.selected .chat-title h4').text();

    // Show the messages of the new chat
    $('#chatTitle').html(theRoom);
    $('.convo').hide();
    $('#' + theRoom).show();

    $('#chat-nav').hide();
  });
});
