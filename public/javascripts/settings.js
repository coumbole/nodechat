$(document).ready( () => {
  /**
   * Open up the user settings panel.
   *
   * This is mainly used for changing
   * the nickname.
   */
  $('#user-settings').click( () => {
    $('#user-nav').css('width', () => {
      return $('.chats').css('width');
    });
  });

  // Close the panel
  $('#closebtn').click( () => {
    $('#user-nav').css('width', '0');
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

