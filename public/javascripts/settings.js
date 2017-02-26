$(document).ready( () => {
  $('#user-settings').click( () => {
    $('#user-nav').css('width', () => {
      return $('.chats').css('width')
    })
  })

  $('#closebtn').click( () => {
    $('#user-nav').css('width', '0')
  })

  $('#searchfield').focus(() => {
    $('.public-chats').css('width', () => {
      return $('.chats').css('width')
    })
  })

  $('#searchfield').focusout( () => {
    $('.public-chats').css('width', '0')
  })

  $('#searchfield').on('keyup', (e) => {
    var value = e.target.value.toLowerCase()
    $('.public-chats .chat .chat-title h4').each( (i, v) => {
      $(v).toggle( $(v).text().toLowerCase().indexOf(value) !== -1 )
    })
  })
})

