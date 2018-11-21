/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcryptjs');
module.exports = {

  attributes: {
    user_id: {
      type: 'string',
      required: true
    },
    username: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true
    },
    auth: {
      type: 'integer'
    },
    orica: {
      type: 'integer'
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },

  beforeCreate: function(user, cb) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          console.log(err);
          cb(err);
        }else{
          user.password = hash;
          cb(null, user);
        }
      });
    });
  },

  beforeUpdate: function(user, cb) {
    if (user.password !== undefined && user.password != '') {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) {
            console.log(err);
            cb(err);
          }else{
            user.password = hash;
            cb(null, user);
          }
        });
      });
    } else {
      cb(null, user);
    }
  },

  /**
   * idでユーザー検索
   * 
   * @param {String|Integer} id 検索したいユーザーのid(ユーザーIDではない)
   * @return {Object} ユーザー情報
   */
  findOneByIdSync: async function (id) {
    if (!id){
        return false;
    } else {
        // ユーザー情報取得
        var user = await User.findOne({ id: id });

        if (!user) {
          return false;
        }

        return user;
    }
}
};

