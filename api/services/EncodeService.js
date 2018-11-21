/**
 * 符号化サービス
 */
module.exports = {

    /**
     * Base64符号化
     * ファイル名に使用するため、"/"は"@"に置き換える
     * 
     * @param {String} str 暗号化するパラメータ
     * @return エンコード済み文字列
     */
    encodeBase64: function(str) {

        // base64 エンコード
        var buf = Buffer.from(str);
        var base64 = buf.toString('base64');
        encodedStr = base64.replace('/', '@');

        return encodedStr;
    },

    /**
     * Base64復号化
     * 
     * @param {String} encodedStr 復号化するパラメータ
     * @return 復号化済み文字列
     */
    decodeBase64: function(encodedStr) {

        // base64 デコード
        base64 = encodedStr.replace('@', '/');
        var string = Buffer.from(base64, 'base64');

        return string.toString();
    }
};