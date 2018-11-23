// ログイン情報取得
var responseJson;
$.ajax({
    type: 'GET',
    url: '/user/getLoginUser',
    dataType: 'json',
    async: false,
    success: function(response) {
        responseJson = response;
    },
    error: function() {
        console.log('ログイン情報取得失敗');
    }
});
var userInfo = responseJson.user;

// チャット取得(デザインは一旦cgi用に作成)
io.socket.get("/message/findAll?limit=50", {}, function(data) {
    var messages = data.data;
    var current_user_id = data.current_user_id;
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
    $.getJSON('//api.ipstack.com/check?access_key=54e37314186c454b8da7e3d569673972', function(data) {
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

// ユーザー一覧受信
io.socket.on('user_list', function(param) {
    if (param.verb == "created") {
        // ユーザー追加
        userListVm.addUserList(param.data);
    } else if (param.verb == "deleted") {
        // ユーザー削除
        userListVm.deleteUserList(param.data);
    }
});

// 参加ユーザーチェック、一覧取得Vm
var userListVm = new Vue({
    el: '.user-list',
    data: {
      userList: []
    },
    methods: {
        addUserList: function(user) {
            for(var userId in user){
                // 自分以外のユーザーの場合追加
                if (userId != userInfo.user_id) {
                    userListVm.$set(userListVm.userList, userId, user[userId]);
                }
            }
        },
        deleteUserList: function(user) {
            for(var userId in user){
                userListVm.$delete(userListVm.userList, userId);
            }
        }
    }
});

// ユーザー一覧取得
io.socket.post('/userList', {listFlg: 1}, function (res) {
    var userList = {};
    for(var userId in res.userList){
        // 自分以外のユーザーを格納
        if (userId != userInfo.user_id) {
            userList[userId] = res.userList[userId];
        }
    }
    userListVm.userList = userList;
});

// var isActive;

window.onfocus = function () { 
  //isActive = true; 
  parent.postMessage({isActive: true}, '*');
};

window.onblur = function () { 
  //isActive = false; 
  parent.postMessage({isActive: false}, '*');
};


// ユーザーチェック（定期）※現状、CGI側で行なっている（本当はしたくない）
// setInterval(function(){
//     io.socket.post('/userList', {listFlg: 0}, function (res) {
//         // TODO　エラーハンドリング入れた方が良い？
//     });
// } , 5000);

