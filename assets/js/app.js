// チャット取得(デザインは一旦cgi用に作成)
io.socket.get("/message/findAll?limit=50", {}, function(data) {
    var messages = data.data;
    var current_user_id = data.current_user_id;
    console.log(current_user_id);
    console.log(messages.length);
    for (var i = messages.length - 1; i >= 0; i--) {
        var ip = messages[i].ip;
        if ( ip == null ) {
            ip = '';
        }
        var d = new Date(messages[i].createdAt);
        var year  = d.getFullYear();
        var month = d.getMonth() + 1;
        var day   = d.getDate();
        var hour  = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
        var min   = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
        var sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();
        var createDate = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
        if (current_user_id == messages[i].id) {
            $("#chat-frame" + messages[i].channel).prepend('<p class="chat-talk mytalk"><span class="talk-user"><span class="talk-icon">' + messages[i].username + "</span></span><span class='talk-content'>" + messages[i].body + '&nbsp&nbsp&nbsp<label class="created-date">--' + createDate + '</label></span></p>');
        } else {
            $("#chat-frame" + messages[i].channel).prepend('<p class="chat-talk"><span class="talk-user"><span class="talk-icon">' + messages[i].username + "</span><span class='talk-ip'>" + ip + "</span></span><span class='talk-content'>" + messages[i].body + '&nbsp&nbsp&nbsp<label class="created-date">--' + createDate + '</label></span></p>');
        }
    }
});

// チャットルームに入る
io.socket.get('/user/listen', {}, function() {});

// チャット受信
io.socket.on('message', function(message) {
    console.log(message);
    var ip = message.data.ip;
    if ( ip == null ) {
        ip = '';
    }
    if (message.verb == "created") {
        var d = new Date(message.data.createdAt);
        var year  = d.getFullYear();
        var month = d.getMonth() + 1;
        var day   = d.getDate();
        var hour  = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
        var min   = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
        var sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();
        var createDate = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
        $("#chat-frame" + message.data.channel).prepend('<p class="chat-talk"><span class="talk-user"><span class="talk-icon">' + message.data.username + "</span><span class='talk-ip'>" + ip + "</span></span><span class='talk-content'>" + message.data.body + '&nbsp&nbsp&nbsp<label class="created-date">--' + createDate + '</label></span></p>');
    }
});

$(".chat-frame").hide();
$("#chat-frame1").show();
$('input[name=channel]').change( function(){
    var channel = $("input[name='channel']:checked").val();
    $(".chat-frame").hide('slow');
    $("#chat-frame" + channel).show('slow');
});

$(".channels").hide();
$('#chat-channel-button').on('click', function(){
    console.log('test');
    if ($('.channels').css('display') == 'block') {
        $(".channels").hide('slow');
    } else {
        $(".channels").show('slow');
    }
});

// チャット投稿
$('#chat-send-button').on('click', function() {
    var $text = $('#chat-textarea');
    var $channel = $("input[name='channel']:checked").val();
    console.log($channel);
    $.getJSON('//geoip.nekudo.com/api/<ip address>', function(data) {
        var ip = data.ip;
    
        var msg = $text.val();
        
        io.socket.post("/message", {
            ip: ip,
            body: msg,
            channel: $channel
        }, function(res) {
            var ip = res.ip;
            if ( ip == null ) {
                ip = '';
            }
            var d = new Date(res.createdAt);
            var year  = d.getFullYear();
            var month = d.getMonth() + 1;
            var day   = d.getDate();
            var hour  = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
            var min   = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
            var sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();
            var createDate = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
            $("#chat-frame" + res.channel).prepend('<p class="chat-talk mytalk"><span class="talk-user"><span class="talk-icon">' + res.username + "</span></span><span class='talk-content'>" + res.body + '&nbsp&nbsp&nbsp<label class="created-date">--' + createDate + '</label></span></p>');
            $text.val('');
        });
    });
});
// カード一覧取得
var cardVm = new Vue({
    el: '.card-list',
    data: {
      cardList: []
    },
    ready: function () {
        
        // 内部メソッドの `this` は cardVm インスタンスを指します
        var self = this
        
        // サーバに GET /card/find としてリクエストする
        io.socket.get('/card/find?limit=50', function (res) {
            self.cardList = res
        })

        io.socket.on('card', function (msg) {
            cardVm.cardList = []
            //console.log('Is it firing',msg);
            if (msg.verb == "created") {
            }
        })
    }
});

var cardCreateVm = new Vue({
    el: '#card-form',
    data: {
      message: ''
    },
    methods: {
        create: function (event) {
            // 内部メソッドの `this` は cardCreateVm インスタンスを指します
            var self = cardCreateVm
            var $name = $('#name')
            var $power = $('#power')

            var name = $name.val()
            var power = $power.val()
            io.socket.post("/card/create", {
                name: name,
                power: power
            }, function (res) {
                self.message = res.message + "</br>"
                $name.val('')
                $power.val('')
                if (res.success) {
                    //cardVm.$emit('card')
                }
            });
        }
    }
});

var newMessage = new Vue({
  el: '.body',

  data: {
    messages: []
  },

  events: {
    'message:created': function (message) {
      this.messages.push(message);
    }
  },

  created: function () {
    var _this = this;

    // サーバに GET /message としてリクエストする
    io.socket.get('/message', function (res) {
      _this.messages = res;
    });

    // io.socket.on でモデルの変更イベントを監視できる
    io.socket.on('message', function (event) {
      // event.verb が変更の種類を表す
      switch (event.verb) {
        case 'created': // created: モデルに新たなデータが追加された
          _this.$emit('message:created', event.data);
          break;
      }
    });
  },

  methods: {
    create: function (event) {
      event.preventDefault(); // submit 時のページ遷移を無効にする

      var _this = this;

      // サーバに POST /message としてリクエストする
      io.socket.post('/message', this.newMessage, function (res) {
        if (res.error) {
          return console.error(res.error);
        }

        _this.$emit('message:created', res);
      });
    }
  }
});



// Socket.IOに接続

// 以下の処理はSocket.IOのconnectメッセージ受信後(接続確立後)
// に行わないと失敗する
/*io.socket.get("/card/find", {}, (cards) => {
    for (var i = 0; i < cards.length; i++)
        demo.data.card_list.push(cards[i].name);
        //$("#card-list").append('<li>' + cards[i].name + '</li>');
});

io.socket.on('card', (card) => {
    if (card.verb == "created") {
        $("#card-list").append('<li>' + card.data.name + '</li>');
    }
});

$('#chat-send-button').on('click', () => {
    var $name = $('#name');
    var $message = $('#message');

    var name = $name.val();

    io.socket.post("/card/create", {
        name: name,
        power: 4000
    }, (res) => {
        if (res.success) {
            
            $("#card-list").append('<li>' + res.name + '</li>');
        } else {
            $message.text(res.message);
        }
        $name.val('');
    });
});
*/

/*
io.socket.get('/card/find', (res) => {
    cardVm.cards = res;
});

io.socket.on('card', (event) => {
    // event.verb が変更の種類を表す
    switch (event.verb) {
        case 'created': // created: モデルに新たなデータが追加された
        _this.emit('card:created', event.data);
        break;
    }
});
*/