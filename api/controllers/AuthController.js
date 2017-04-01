/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');
module.exports = {
  login: function (req, res) {
    res.view();
  },
  // cgiからのログイン(chat用)
  processChat: function (req, res) {
    passport.authenticate('local', function (err, user, info) {
      if ((err) || (!user)) {
        return res.send({
          message: 'ログインに失敗しました。'
        });
      }
      req.logIn(user, function (err) {
        if (err) res.send(err);
        return res.redirect("/lobbyCgi");
      });
    })(req, res);
  },
  process: function (req, res) {
    passport.authenticate('local', function (err, user, info) {
      if ((err) || (!user)) {
        return res.send({
          message: 'ログインに失敗しました。'
        });
      }
      req.logIn(user, function (err) {
        if (err) res.send(err);
        return res.redirect("/");
      });
    })(req, res);
  },
  logout: function (req, res) {
    req.logout();
    res.send('ログアウトしました。');
  }
};
module.exports.blueprints = {

  // Expose a route for every method,
  // e.g.
  // `/auth/foo` =&gt; `foo: function (req, res) {}`
  actions: true,

  // Expose a RESTful API, e.g.
  // `post /auth` =&gt; `create: function (req, res) {}`
  rest: true,

  // Expose simple CRUD shortcuts, e.g.
  // `/auth/create` =&gt; `create: function (req, res) {}`
  // (useful for prototyping)
  shortcuts: true

};
