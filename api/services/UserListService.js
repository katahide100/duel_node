/**
 * 参加ユーザー一覧サービス
 */
module.exports = {

    /**
     * ファイルパス取得
     * 
     * @description :: ユーザーID、ユーザー名を元にファイルパスを取得する
     *  ファイル名形式：{ユーザーID}_{ユーザー名}.txt
     * 
     * @param {String} id   ユーザーID
     * @param {String} name ユーザー名
     * @return {String} 生成したファイルパス
     */
	getFilePath: function(id, name) {
        
        const userListConsts = sails.config.const.user_list;

        // ユーザー名は符号化する
        var encName = EncodeService.encodeBase64(name);
        var filePath = userListConsts.active_user_dir + id + "_" + encName + ".txt";
        var fs = require('fs');

        return filePath;
    },

    /**
     * 参加ユーザー存在確認
     * 
     * @description :: 参加ユーザーのファイルが存在するか確認します。
     * 
     * @param  {String}  path 検索したいファイルのパス
     * @return {Boolean} 結果 true:存在する false:存在しない -1:エラー
     */
	checkExists: function(path) {

        const fs = require('fs');

        try {
            fs.statSync(path);
            return true;
        } catch (error) {
            if (error.code === 'ENOENT') {
                return false;
            } else {
                return -1;
            }
        }
    },

    /**
     * 参加ユーザー追加、更新
     * 
     * @description :: 参加ユーザーのファイルを作成、更新する。
     * 
     * @param {String} path 作成、更新したいファイルのパス
     * @return {Boolean} 結果 true:成功
     */
	create: function(path) {

        // ファイルに書きこむ日付取得(秒単位)
        const date = new Date() ;
        var dateTime = date.getTime() ;
        dateTime = Math.floor( dateTime / 1000 );
        const body = dateTime;

        const fs = require('fs');

        try {
            // ファイルに書き込み
            fs.writeFileSync(path, body);
          } catch(err) {
            return false;
        }

        return true;
    },

    /**
     * 参加ユーザー削除
     * 
     * @description :: 参加ユーザーのファイルを削除する。
     * 
     * @param {String} path 削除したいファイルのパス
     * @return {Boolean} 結果 true:成功
     */
	delete: function(path) {

        const fs = require('fs');

        try {
            // ファイルに書き込み
            fs.unlinkSync(path);
          } catch(err) {
            return false;
        }

        return true;
    },

    /**
     * 参加ユーザー一覧取得
     * 
     * @description :: 参加ユーザーのファイル一覧から、ユーザー一覧を作成して返します。
     * 
     * @return {Object|Integer} 参加ユーザー一覧　{XXX11111: "test", XXX22222: "test2"} -1:エラー
     */
	getAll: function() {

        const userListConsts = sails.config.const.user_list;
        const dir = userListConsts.active_user_dir;
        const fs = require('fs');
        var userList = {};
        
        try {
            // 自分のファイルを作成した後のため、必ず1ファイルはある前提
            var fileList = fs.readdirSync(dir);
            fileList.forEach(function(file) {
                // 拡張子と分ける
                var arrFile = file.split(/\.(?=[^.]+$)/);
                // ユーザーIDとユーザー名を取得
                var arrFileName = arrFile[0].split('_');
                var userName = EncodeService.decodeBase64(arrFileName[1]);
                userList[arrFileName[0]] = userName;
            });

            return userList;
        } catch(err) {
            return -1;
        }
    },

    /**
     * 退室したユーザーのファイルを削除する
     * 
     * @description :: 参加ユーザーのファイル一覧から、一定時間経っているか確認し、経っている場合は削除する
     * 
     * @return {Object|Integer} 削除ユーザー一覧　{XXX11111: "test", XXX22222: "test2"} -1:エラー
     */
	checkAndDelete: function() {

        // 比較対象の時間を取得
        const date = new Date() ;
        var dateTime = date.getTime() ;
        dateTime = Math.floor( dateTime / 1000 );

        const userListConsts = sails.config.const.user_list;
        const dir = userListConsts.active_user_dir;
        const fs = require('fs');
        // 削除したユーザー一覧格納用
        var deleteUserList = {};
        
        try {
            // ファイル読み込み
            var fileList = fs.readdirSync(dir);
            fileList.forEach(function(file) {
                var fileTime = fs.readFileSync(dir + file);

                // 一定時間経ったものを削除する
                if ((dateTime - fileTime) > 10) {
                    // 削除
                    fs.unlinkSync(dir + file);

                    // 拡張子と分ける
                    var arrFile = file.split(/\.(?=[^.]+$)/);
                    // ユーザーIDとユーザー名を取得
                    var arrFileName = arrFile[0].split('_');
                    var userName = EncodeService.decodeBase64(arrFileName[1]);
                    deleteUserList[arrFileName[0]] = userName;
                }
            });

            return deleteUserList;
        } catch(err) {
            return -1;
        }
    },
};