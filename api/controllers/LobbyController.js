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

    index: function (req, res) {

        // ログインonly ダッシュボード
        return res.view('lobby');
    }
};

