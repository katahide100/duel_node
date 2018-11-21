/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    listen: function (req, res) {
        sails.sockets.join(req, 'lobby', function(err) {
            if (err) {
              return res.serverError(err);
            }
        });
    },

    /**
     * ログインユーザー取得
     * 
     * @param req リクエストオブジェクト
     * @param res レスポンスオブジェクト
     * @return レスポンス
     */
    getLoginUser: async function (req, res) {
        const consts = sails.config.const;
        // ユーザーID、ユーザー名取得
        var user = await UserService.getLoginUser(req);
        if (!user) {
            return res.serverError({code: consts.res_code.SYSTEM_ERR, message: 'ユーザー情報が取得できませんでした。'});
        }
        return res.ok({code: consts.res_code.SUCCESS, user: user});
    }
};

