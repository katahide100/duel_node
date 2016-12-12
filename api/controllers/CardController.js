/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /*
    _config: {
        actions: false,
        shortcuts: false,
        rest: false
    },*/

    list: function (req, res) {

        // ログインonly
        return res.view('card/list');
    },

    create_index: function(req, res) {
        return res.view('card/create', {message: ''});
    },

    create: function(req, res) {
        var name = req.param('name');
        var power = req.param('power');
        if (!name || !power){
            return res.json({success: false, message: 'バリデーションエラー'});
        } else {
            Card.create({name: name, power: power}).exec(function (err, message) {
                if (!err) {
                    //sails.sockets.emit('', 'card', {name: name, power: power});
                    return res.json({success: true,message: '登録しました'});
                } else {
                    return res.json({success: false, message: '登録エラー'});
                }
            });
        }
    }
};

