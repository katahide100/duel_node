$(".chat-log-frame").hide();
$("#chat-log-frame1").show();
$('input[name=log-channel]').change( function(){
    var channel = $("input[name='log-channel']:checked").val();
    $(".chat-log-frame").hide('slow');
    $("#chat-log-frame" + channel).show('slow');
});

$(".log-channels").hide();
$('#chat-log-channel-button').on('click', function(){
    if ($('.log-channels').css('display') == 'block') {
        $(".log-channels").hide('slow');
    } else {
        $(".log-channels").show('slow');
    }
});

// チャットログ検索
$('#chat-log-search-button').on('click', function() {
    var $date = $('#chat-log-date');
    io.socket.get("/message/findLog?limit=50&date=" + $date.val(), {}, function(data) {
        var messages = data.data;
        
        var current_user_id = data.current_user_id;
        $(".chat-log-frame").empty();
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
                $("#chat-log-frame" + messages[i].channel).prepend('<p class="chat-talk mytalk"><span class="talk-user"><span class="talk-icon">' + messages[i].username + "</span></span><span class='talk-content'>" + messages[i].body + '&nbsp&nbsp&nbsp<label class="created-date">--' + createDate + '</label></span></p>');
            } else {
                $("#chat-log-frame" + messages[i].channel).prepend('<p class="chat-talk"><span class="talk-user"><span class="talk-icon">' + messages[i].username + "</span><span class='talk-ip'>" + ip + "</span></span><span class='talk-content'>" + messages[i].body + '&nbsp&nbsp&nbsp<label class="created-date">--' + createDate + '</label></span></p>');
            }
        }
    });
});