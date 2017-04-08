$(document).ready(function() {
// http://parse.sfm8.hackreactor.com/chatterbox/classes/messages
  var App = function() {
    this.friends = [];
    this.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/' + this.room;
    this.rooms = [];
    this.messages = [];
    this.renderIndex = 0;
    this.room = "";
  };

  App.prototype.init = function() {

    // console.log("Initializing App...");

    this.fetch();


    $('body').on('click', '.username', this.handleUsernameClick);
    $('.submit').on('click submit', this.handleSubmit);

    $('#addNewRoom').on('keyup',function(e){

      var code = (e.keyCode ? e.keyCode : e.which);
      if (code == 13) { 
        var room = $("#addNewRoom").val();
        $("#addNewRoom").val('');
        app.renderRoom(room);
      }

    })
      // create compose
      var $compose_field = $('<div id="composing" class="placeholder" contenteditable="true" role="textbox"></div>');
      $compose_field.appendTo($('#compose'));
      $compose_field.on('keyup', function(e) {

      // make compose send on return key
      var code = (e.keyCode ? e.keyCode : e.which);
      if (code == 13) { $('.submit').click(); }

  });

    // <script>
    //   $('body').css('overflow','hidden !important');
    //   $('<div style="background-color: white; color: white, min-height: 2000px !important; min-width: 2000px !important;></div>').appendTo('body');
    // </script>


  };

  App.prototype.send = function(data) {
    var app = this;
    // console.log("this",this.server)
    $.ajax({
      type: 'POST',
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/'+ app.room,
      // crossServer: true,
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

    var app = this;

    var getEm = function() {
      $.ajax({
        type: 'GET',
        url: app.server,
        contentType: 'application/json',
        data: {
          order: "-createdAt"
        },

        success: function(data) {
          // remember to store the rooms!

          /*
            username
            text
            roomName
            objectId
            createdAt
          */

          if (data.results) {
          // first time we get messages, we order them from oldest to newest ( message.createdat )
            if ( app.messages.length === 0 ){

                var messages = data.results.sort(function(a,b){ return b.createdAt - a.createdAt; });
                // console.log("messages",messages);
                app.messages = messages.slice(0,21);
                app.getFeed(messages);

            } else {

              // on fetch, grab the message id of the last message we have stored
              var lastMessage = app.messages[app.messages.length-1];
              // console.log("lastMessage",lastMessage);

              // find the index of that message in the data.messages 
              var messages = data.results.sort(function(a,b){ return a.createdAt - b.createdAt  ; });
              var matchLastMessageIndex;

              messages.forEach(function(message,index){
                if ( message.objectId === lastMessage.objectId ){ matchLastMessageIndex = index; }
              });

              // slice the messages from that index to newest
              var newMessages = messages.reverse().slice(matchLastMessageIndex+1);
              // console.log("newMessages",newMessages);

              newMessages.forEach(function(message,index){

                // push to our arr
                app.messages.push(message);

                // save room
                if (!app.rooms.includes(message.roomname)){
                  app.renderRoom(message.roomname);
                }
                // render it
                app.renderMessage(message);
              });
              // push only that group to our messages

              // cap our messages at 100
              app.messages.slice(0,100);
            }
          // keep record of this.renderIndex to know where in our messages we must start rendering from
          // on each new fetch, push to our messages array ( to end, so theyll have a greater index )
          // then prepend to our #chat, starting from our renderIndex to current meesages.length index



            // context.getFeed(data.results);

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

      // app.clearMessages();
      getEm();

    }, 1000);
  };

  App.prototype.clearMessages = function() {

    $('#chats').empty();
  };

  App.prototype.renderMessage = function(message) {
    var htmlMessage = `
    <div class='message'>
      <a class="username" data-username="${message.username}">
        ${ this.sanitize(message.username) }
      </a>
      <p class="messageText">
        ${ this.sanitize(message.text) }
      </p>
      <p class="messageRoomName">
        ${message.roomname} @ ${ this.timeAgo( message.createdAt ) }
      </p>

    </div>`;

    $('#chats').prepend(htmlMessage);
    while ( $('#chats').children().length > 20) {
      //console.log($('#chats').children().length);
      $('#chats').children().last().remove();
    }
    // increase render index
    this.renderIndex++;
  };

  App.prototype.renderRoom = function(roomName) {

    app.rooms.push(roomName);
    var htmlRoom = `<option value="${roomName}">${roomName}</option>`;
    $('#roomSelectInput').append(htmlRoom);
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

    var composetext = $('#composing');
    console.log("SUBMIT?",composetext);

    var message = {
      username: window.location.search.slice(10),
      text: composetext.text(),
      roomname: $("#roomSelectInput").val()
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