/**
 * ユーザー一覧サービス
 */
module.exports = {

    /**
     * ログインユーザー取得
     * 
     * @param {Object} req   リクエストオブジェクト
     * @return {Object|Boolean} 取得したユーザー情報 false:失敗
     */
	getLoginUser: async function(req) {
        
        const consts = sails.config.const;

        // ユーザー情報取得
        var id = req.session.passport.user;
        var user = await User.findOneByIdSync(id);
        if (!user){
            return false;
        }
        return user;
    },
};