/**
 * UserListController
 *
 * @description :: チャットのユーザーリスト管理
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * 参加済みかチェック
     * 
     * @description :: 対象ユーザーが参加済みかチェックし、ファイル更新
     *  初期表示、定期チェック時に呼び出す
     *  ファイルを作成、更新し、必要な場合は一覧を返す
     * 
     * @param req リクエストオブジェクト
     * @param res レスポンスオブジェクト
     * @return レスポンス
     */
	activeCheck: async function(req, res) {

        // パラメータ取得
        const listFlg = req.param('listFlg'); // 一覧が必要かどうか 0:不要, 1:必要

        var userList = [];                    // 返却するユーザー一覧
        const consts = sails.config.const;
        const userListConsts = consts.user_list;
        var userId = "";
        var userName = "";

        // ユーザーID、ユーザー名取得
        if (req.param('user_id')) {
            // CGIの場合はパラメータで渡ってくる
            userId = req.param('user_id');
            userName = req.param('user_name');
        } else {
            var user = await UserService.getLoginUser(req);
            if (!user) {
                return res.serverError({code: consts.res_code.SYSTEM_ERR, message: 'ユーザー情報が取得できませんでした。'});
            }

            userId = user.user_id;    // ユーザーID
            userName = user.username; // ユーザー名
        }
        
        // ファイルのパス取得
        const filePath = UserListService.getFilePath(userId, userName);

        // ユーザーの参加ファイル存在確認
        var userExistFlg = UserListService.checkExists(filePath);
        if (userExistFlg == -1) {
            return res.serverError({code: consts.res_code.SYSTEM_ERR, message: '参加ユーザーファイル検索に失敗しました。'});
        }

        // ファイル新規作成、更新
        if (!UserListService.create(filePath)) {
            return res.serverError({code: consts.res_code.SYSTEM_ERR, message: 'ファイルの作成、更新に失敗しました。'});
        }

        // ファイルが存在しなかった（新規作成した）場合、emit
        if (!userExistFlg) {
            sails.sockets.broadcast('lobby','user_list',{verb: 'created', data: {[userId]: userName}}, req);
        }

        if (listFlg == userListConsts.user_list_flg.GET) {
            // 一覧が必要な場合ファイル一覧からユーザー名一覧を取得
            if ((userList = UserListService.getAll()) == -1) {
                return res.serverError({code: consts.res_code.SYSTEM_ERR, message: 'ユーザー一覧取得に失敗しました。'});
            }
        }

        return res.ok({code: consts.res_code.SUCCESS, userList: userList, listFlg: listFlg});
    },

    /**
     * 参加一覧から削除
     * 
     * @description :: 対象ユーザーが参加中か確認し、参加している場合はファイル削除
     *  ブラウザを閉じた際などに呼び出す
     * 
     * @param req リクエストオブジェクト
     * @param res レスポンスオブジェクト
     * @return レスポンス
     */
	leave: async function(req, res) {

        const consts = sails.config.const;

        // ユーザーID、ユーザー名取得
        var user = await UserService.getLoginUser(req);
        if (!user) {
            return res.serverError({code: consts.res_code.SYSTEM_ERR, message: 'ユーザー情報が取得できませんでした。'});
        }
        var userId = user.user_id;    // ユーザーID
        var userName = user.username; // ユーザー名

        // ファイルのパス取得
        const filePath = UserListService.getFilePath(userId, userName);

        // ユーザーの参加ファイル存在確認
        var userExistFlg = UserListService.checkExists(filePath);
        if (userExistFlg == -1) {
            return res.serverError({code: consts.res_code.SYSTEM_ERR, message: '参加ユーザーファイル検索に失敗しました。'});
        }

        // ファイルが存在した場合、ファイルを削除し、emit
        if (userExistFlg) {
            // 削除
            if (!UserListService.delete(filePath)) {
                return res.serverError({code: consts.res_code.SYSTEM_ERR, message: 'ファイルの削除に失敗しました。'});
            }

            // emit
            sails.sockets.broadcast('lobby','user_list',{verb: 'deleted', data: {[userId]: userName}}, req);
        }

        return res.ok({code: consts.res_code.SUCCESS});
    },

    /**
     * 参加していないユーザーを判定し削除
     * 
     * @description :: 全ユーザーから、すでに退室したユーザーを削除する
     *  バッチで定期実行する
     *  ユーザーファイルを確認し、一定時間たったものを削除する
     * 
     * @param req リクエストオブジェクト
     * @param res レスポンスオブジェクト
     * @return レスポンス
     */
	checkAndDelete: function(req, res) {

        const consts = sails.config.const;
        var deletedUsers = {};

        // ファイルをチェックし、退室済みを削除
        if ((deletedUsers = UserListService.checkAndDelete()) == -1) {
            return res.serverError({code: consts.res_code.SYSTEM_ERR, message: 'ユーザー削除に失敗しました。'});
        }
        
        // 削除ユーザーがいた場合はemit
        if (Object.keys(deletedUsers).length) {
            sails.sockets.broadcast('lobby','user_list', {verb: 'deleted', data: deletedUsers}, req);
        }

        return res.ok({code: consts.res_code.SUCCESS});
    },
};

