$(window).ready( () => {

  /* eslint-disable */
  var socket = io.connect('localhost:3000');
  /* eslint-enable */

  // WHen the site is loaded, hide the settings
  // panel and set it's width 
  $('.settings').hide();
  /**
   * Open up the user settings panel.
   * This is mainly used for changing
   * the nickname.
   */

  $('i.fa-bars').click( (e) => {
    //alert('target: ' + $(e.target).closest('header').siblings('.settings').html());
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
  $('#nickfield').focusout( () => {
    $('#nickfield').attr('readonly', true);
    var newnick = $('#nickfield').val();
    /* eslint-disable */
    var data = {
      nick: newnick,
      userid: user.uid,
      currentroom: $('.selected').text()
    };
    alert('currentroom ' + $('.selected').text());
    /* eslint-enable */
    socket.emit('updatenick', (data));
  });

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
});

