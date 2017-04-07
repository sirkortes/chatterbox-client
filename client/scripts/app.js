// YOUR CODE HERE:

// $.get('http://parse.hrm8.hackreactor.com/chatterbox/classes/messages', function ( data ) {
//  console.log("data",data);
//  $('chats').html(data);
// } )
var url = 'http://parse.hrm8.hackreactor.com';
var app = {};
app.init = () => {

};

app.send = (data) => {
  $.ajax({
    type: 'POST',
    url: url,
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: () => { console.log('chatterbox: Message sent'); },
    error: () => { console.log('chatterbox: Message was not sent'); }
  });
};

app.fetch = (data) => {
  $.ajax({
    type: 'GET',
    // url: url,
    data: data,
    contentType: 'application/json',
    success: (data) => { 
      console.log('chatterbox: Message fetched'); 
      data = JSON.parse(data);
      $('#chat').append(data);
    },
    error: (err) => { console.log('chatterbox: Message was not fetched',err); }
  });
};

app.clearMessages = () => {
  $('#chats').empty();
};

app.renderMessage = (message) => {
  var htmlMessage = `<div class='message'>${JSON.stringify(message)}</div>`;
  $('#chats').append( htmlMessage);
};

app.renderRoom = (roomName) => {
  var htmlRoom = `<div id='#${roomName}'></div>`;
  $('#roomSelect').append(htmlRoom);
};


// Post to chatterbox
// $.ajax({
//   // This is the url you should use to communicate with the parse API server.
//   url: 'http://parse.CAMPUS.hackreactor.com/chatterbox/classes/messages',
//   type: 'POST',
//   data: JSON.stringify(message),
//   contentType: 'application/json',
//   success: function (data) {
//     console.log('chatterbox: Message sent');
//   },
//   error: function (data) {
//     // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//     console.error('chatterbox: Failed to send message', data);
//   }
// });