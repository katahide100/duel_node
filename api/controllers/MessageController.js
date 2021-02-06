/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function(req, res) {
        var ip = '0.0.0.0';
        if (req.socket && req.socket.handshake.address) {
          ip = req.socket.handshake.address;
        }
        var body = req.param('body');
        var channel = req.param('channel');

        // セッションからユーザーIDを取得
        var user_id = req.session.passport.user;
        if (!body || !user_id){
            return res.json({success: false, message: 'バリデーションエラー'});
        } else {
            Message.create({ip: ip, body: body, user_id: user_id, channel: channel}).exec(function (err, res2) {
                // TODO エラーハンドリングを考える
                var query = 'SELECT *, message.createdAt as createdAt FROM message INNER JOIN user ON message.user_id = user.id WHERE message.id = ' + res2.id;

                Message.query(query,function(err,data){
                    // 自分以外の人にメッセージ送信
                    sails.sockets.broadcast('lobby','message',{verb: 'created', data: data[0]}, req);
                    sails.sockets.broadcast('lobby','typing',{verb: 'stop', data: user_id}, req);
                    return res.json(data[0]);
                });
            });
        }
    },
    // 一覧表示用
    findAll: function(req, res) {
        
        var limit = 50;
        if (req.query.limit != undefined && req.query.limit != '') {
            limit = req.query.limit;
        }

        var query = '';
        for (var i=1;i <= 8;i++) {
            query = query + '(select *, msg.createdAt as createdAt from message msg INNER JOIN user ON  msg.user_id = user.id where channel=' + i + ' order by msg.createdAt desc limit ' + limit + ')';
            if (i != 8) {
                query = query + ' UNION ';
            }
        }

        //var query = 'SELECT *, msg.createdAt as createdAt FROM message msg INNER JOIN user ON  msg.user_id = user.id WHERE ( SELECT COUNT(*) FROM message msg2 WHERE msg2.channel = msg.channel AND msg2.createdAt > msg.createdAt ) < ' + limit + ' ORDER BY msg.channel DESC, msg.createdAt DESC';
        
        var user_id = req.session.passport.user;
        if(global.gc) {
            global.gc(); // メモリ解放
        }
        Message.query(query,function(err,data){
            var resData = {data: data, current_user_id: user_id};
            return res.json(resData);
        });
    },
    // ログ検索
    findLog: function(req, res) {
        
        var limit = 3000;
        // 一旦固定
        /*if (req.query.limit != undefined && req.query.limit != '') {
            limit = req.query.limit;
        }*/

        // 検索範囲日時
        var dateWhere = '';
        if (req.query.date != undefined && req.query.date != '') {
            var date = req.query.date;
            var arrDate = date.split(' - ');
            if (arrDate[1] === undefined || arrDate[1] == '') {
                arrDate[1] = arrDate[0];
            }
            dateWhere = ' msg.createdAt > "' + arrDate[0] + ' 00:00:00" AND msg.createdAt < "' + arrDate[1] + ' 23:59:59" ';
        }

        var query = 'SELECT *, msg.createdAt as createdAt FROM message msg INNER JOIN user ON  msg.user_id = user.id WHERE ' + dateWhere + ' ORDER BY msg.channel DESC, msg.createdAt DESC LIMIT ' + limit;
        var user_id = req.session.passport.user;
        if(global.gc) {
            global.gc(); // メモリ解放
        }
        Message.query(query,function(err,data){
            var resData = {data: data, current_user_id: user_id};
            return res.json(resData);
        });
    },
    typingStart: async function(req, res) {
        var channel = req.param('channel');

        // セッションからユーザーIDを取得
        var user = await UserService.getLoginUser(req);
        if (!user) {
            return res.serverError({code: consts.res_code.SYSTEM_ERR, message: 'ユーザー情報が取得できませんでした。'});
        }
        var userName = user.username; // ユーザー名
        // 自分以外の人に送信
        sails.sockets.broadcast('lobby','typing',{verb: 'start', data: userName}, req);
        return res.json(user_id);
    }
};

