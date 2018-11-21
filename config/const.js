/**
 * Const Variable Configuration
 * (sails.config.const)
 *
 */
module.exports.const = {

    // レスポンスコード
    res_code : {
        SUCCESS : "0000",
        SYSTEM_ERR : "9999"
    },

    // 参加ユーザーリスト系
    user_list : {
        // 参加ユーザーファイルディレクトリ
        active_user_dir : "./data/active_users/",

        // 参加ユーザー一覧取得フラグ
        user_list_flg : {
            NOT_GET : 0, // 取得しない
            GET : 1      // 取得する
        }
    }
};
  