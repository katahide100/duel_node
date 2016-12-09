var mySocket = io.sails.connect();
// チャット取得
io.socket.get("/message/find?limit=100", {}, function(messages) {
    for (var i = 0; i < messages.length; i++) {
    $("#chat-timeline").append('<li>' + messages[i].body + '</li>');
    }
});
// チャット受信
io.socket.on('message', function(message) {
    if (message.verb == "created") {
        $("#chat-timeline").append('<li>' + message.data.body + '</li>');
    }
});
// チャット投稿
$('#chat-send-button').on('click', function() {
    var $text = $('#chat-textarea');

    var msg = $text.val();
    
    io.socket.post("/message", {
        body: msg
    }, function(res) {
        $("#chat-timeline").append('<li>' + res.body + '</li>');
        $text.val('');
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
        io.socket.get('/card/find?limit=100', function (res) {
            self.cardList = res
        })

        io.socket.on('card', function (msg) {
            cardVm.cardList = []
            console.log('aaaa')
            alert('tuuka')
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