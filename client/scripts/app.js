$(document).ready(function() {


  var App = function() {
    this.friends = [];
    this.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
    // this.messages = [];
  };

  App.prototype.init = function() {

    // console.log("Initializing App...");

    this.fetch();


    $('body').on('click', '.username', this.handleUsernameClick);
    $('.submit').on('click submit', this.handleSubmit);

    console.log(this.messages);

    var $compose_field = $('<div id="composing" class="placeholder" contenteditable="true" role="textbox"></div>');

    $compose_field.appendTo($('#compose'));

    $compose_field.on('keyup', function(e) {



      var code = (e.keyCode ? e.keyCode : e.which);
      if (code == 13) { //Enter keycode

        // var composetext = $compose_field.text();
        // $compose_field.text('');
        // console.log("SUBMIT?",composetext);

        $('.submit').trigger('click submit');
      }
    });



  };

  App.prototype.send = function(data) {
    $.ajax({
      type: 'POST',
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
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

  App.prototype.getFeed = function(messages) {
    messages.forEach(function(message) {
      app.renderMessage(message);
    });
  };

  App.prototype.sanitize = function(s) {
    if (s === ''){ return ' '};
    if (s === undefined) {
      return ' ';
    };

    return s.replace(/[^a-zA-Z0-9.-]/g, function(match) {
      // return ' '+match[0].charCodeAt(0).toString(16)+' ';
      return ' ';
    });
  };

  App.prototype.timeAgo = function(timed) {

    var time = new Date(timed);
    milliseconds = time.getTime();
    var now = new Date().getTime();
    var elapsed = (now - milliseconds);
    var secs = Math.ceil(elapsed / 1000);
    var mins = Math.floor(secs / 60);
    var hours = Math.floor(mins / 60);
    var days = Math.floor(hours / 24);
    if (days > 0) {
      return days + "d";
    } else if (hours > 0) {
      return hours + "h";
    } else if (mins > 0) {
      return mins + "m";
    } else {
      return secs + "s";
    }
  };



  App.prototype.fetch = function() {

    var context = this;
    var getEm = function() {
      $.ajax({
        type: 'GET',
        url: context.server,
        contentType: 'application/json',
        data: {
          order: "-createdAt"
        },

        success: function(data) {

          // console.log('messages fetched', data.results.length);
          if (data.results) {
            context.getFeed(data.results);
          } else {
            console.log("No data results", data);
          }

          // console.log(context.messages.length,"got messages");


          // render Messages
          // check for all rooms, render rooms message.roomname

        },

        error: function(err) {
          console.log('chatterbox: Message was not fetched', err);
        }

      });
    };

    getEm();

    setInterval(function() {

      context.clearMessages();
      getEm();

    }, 5000);

  };


  App.prototype.clearMessages = function() {

    $('#chats').empty();
  };

  App.prototype.renderMessage = function(message) {
    var htmlMessage = `
    <div class='message'>
      <a class="username" data-username="${message.username}">
        ${message.username}
      </a>
      <p class="messageText">
        ${ this.sanitize(message.text) }
      </p>
      <p class="messageRoomName">
        ${message.roomname} @ ${ this.timeAgo( message.createdAt ) }
      </p>

    </div>`;
    $('#chats').append(htmlMessage);
  };

  App.prototype.renderRoom = function(roomName) {
    var htmlRoom = `<option value="${roomName}">${roomName}</option>`;
    $('#roomSelect').append(htmlRoom);
  };


  App.prototype.handleUsernameClick = function(event) {

    var username = $(this).data('username');
    if (!app.friends.includes(username)) {
      app.friends.push(username);
    }
    console.log("friends", app.friends);

  };

  App.prototype.handleSubmit = function() {
    console.log("SUBMITTING");
    var message = {
      username: window.user,
      text: $('#composing').text()
    };

    // erase textbox
    $('#composing').text('');
    console.log(message);
    App.prototype.send(message);
  };


  // Events
  // <option value="saab">Saab</option>
  /*
      
  */




  app = new App();
  app.init();
  // console.log(app);

});