$(document).ready(function() {



  // $.get('http://parse.hrm8.hackreactor.com/chatterbox/classes/messages', function ( data ) {
  //  console.log("data",data);
  //  $('chats').html(data);
  // } )
  // var url = 'http://parse.hrm8.hackreactor.com/';

  var App = function() {
    this.friends = [];
    this.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
  };

  App.prototype.init = function() {
    console.log("Initializing App...");
    this.fetch();
  };

  App.prototype.send = function(data) {
    $.ajax({
      type: 'POST',
      url:  'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      crossServer: true,
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function() {
        console.log('chatterbox: Message sent');
      },
      error: function() {
        console.log('chatterbox: Message was not sent');
      }
    });
  };

  App.prototype.fetch = function() {

    $.ajax({
      type: 'GET',
      url: this.server,
      contentType: 'application/json',

      success: function(data) {
        console.log('chatterbox: Message fetched', data);
        // data = JSON.parse(data);
        data.results.forEach(function(message) {
          console.log("message:", message);
          App.prototype.renderMessage(message);
        });
      },

      error: function(err) {
        console.log('chatterbox: Message was not fetched', err);
      }

    });

    // $.get( App.prototype.server, function(data){
    //   
    // })
  };

  App.prototype.clearMessages = function() {

    $('#chats').empty();
  };

  App.prototype.renderMessage = function(message) {
    var htmlMessage = `
    <div class='message'>
      <a class="username" onclick="app.handleUsernameClick('${message.username}')">
        ${message.username}
      </a>
      <p class="messageText">
        ${message.text}
      </p>
      <p class="messageRoomName">
        ${message.roomname}
      </p>
    </div>`;
    $('#chats').append(htmlMessage);
  };

  App.prototype.renderRoom = function(roomName) {
    var htmlRoom = `<div id='#${roomName}'></div>`;
    $('#roomSelect').append(htmlRoom);
  };

  App.prototype.handleUsernameClick = function(userName) {

    this.friends.push(userName);
  };

  $('.submit').on('click', function(event){

    App.prototype.handleSubmit();

  });

  App.prototype.handleSubmit = function() {
    var message = {
      text: $('#message').val()
    };
    console.log(message);
    App.prototype.send(message);
  };

  // $('#send').on('click', function(event) {

  // });


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

  app = new App();
  app.init();
  console.log(app);

});