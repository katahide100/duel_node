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
        // セッションからユーザーIDを取得
        var user_id = req.session.passport.user;
        if (!body || !user_id){
            return res.json({success: false, message: 'バリデーションエラー'});
        } else {
            Message.create({ip: ip, body: body, user_id: user_id}).exec(function (err, res2) {
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
        var query = 'SELECT *, message.createdAt as createdAt FROM message INNER JOIN user ON message.user_id = user.id ORDER BY message.createdAt';
        if (req.query.limit != undefined && req.query.limit != '') {
            query = query + ' LIMIT ' + req.query.limit;
        }
        
        var user_id = req.session.passport.user;
        Message.query(query,function(err,data){
            var resData = {data: data, current_user_id: user_id};
            return res.json(resData);
        });
    }
};

