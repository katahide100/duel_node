/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function(req, res) {
        var ip = req.param('ip');
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

        var query = 'SELECT *, msg.createdAt as createdAt FROM message msg INNER JOIN user ON  msg.user_id = user.id WHERE ( SELECT COUNT(*) FROM message msg2 WHERE msg2.channel = msg.channel AND msg2.createdAt > msg.createdAt ) < ' + limit + ' ORDER BY msg.channel DESC, msg.createdAt DESC';
        
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
        
        var limit = 1000;
        if (req.query.limit != undefined && req.query.limit != '') {
            limit = req.query.limit;
        }

        // 検索範囲日時
        var dateWhere = '';
        if (req.query.date != undefined && req.query.date != '') {
            var date = req.query.date;
            var arrDate = date.split(' - ');
            dateWhere = ' AND msg.createdAt > "' + arrDate[0] + ' 00:00:00" AND msg.createdAt < "' + arrDate[1] + ' 23:59:59" ';
        }

        var query = 'SELECT *, msg.createdAt as createdAt FROM message msg INNER JOIN user ON  msg.user_id = user.id WHERE ( SELECT COUNT(*) FROM message msg2 WHERE msg2.channel = msg.channel AND msg2.createdAt > msg.createdAt ) < ' + limit + dateWhere + ' ORDER BY msg.channel DESC, msg.createdAt DESC';
        var user_id = req.session.passport.user;
        if(global.gc) {
            global.gc(); // メモリ解放
        }
        Message.query(query,function(err,data){
            var resData = {data: data, current_user_id: user_id};
            return res.json(resData);
        });
    }
};

