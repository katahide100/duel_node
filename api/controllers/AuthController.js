/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');
module.exports = {
	


  /**
   * `AuthController.login()`
   */
  login: function (req, res) {
    // ログイン画面表示
    return res.view();
  },


  /**
   * `AuthController.process()`
   */
  /*
  process: function (req, res) {

    // ログイン承認処理
    passport.authenticate('local', function(err, user, info) {
      if ((err) || (!user)) {
        return res.send({
          message: 'login failed'
        });
      }

      req.logIn(user, function(err) {
        console.log('tuuka1');
        if (err) res.send(err);
        return res.redirect("/lobby");
      });

    })(req, res);

  },*/

  process: function(req, res){
    passport.authenticate('local', function(err, user, info) {
      if ((err) || (!user)) {
        return res.send({
          message: 'login failed'
        });
      }
      req.logIn(user, function(err) {
        if (err) res.send(err);
        req.session.authenticated = true;
        return res.send({
          message: 'login successful'
        });
      });
    })(req, res);
  },

/*
  process: function(req, res){  
    passport.authenticate('local', function(err, user, info) {

        console.log(info);

        if ((err) || (!user)) {
            return res.send({
                message: 'login failed'
            });
        }

        // req.isAuthenticated() -> false
        // req.user -> undefined

        req.logIn(user, function(err) {
            if (err) res.send(err);

            // req.isAuthenticated() -> true
            // req.user -> user -> When new LocalStrategy, Callback user Object

            return res.redirect("/lobby");

        })(req, res);
    });
  },
  */
  /**
   * `AuthController.logout()`
   */
  logout: function (req, res) {
    ////
    // ログイン承認解除
    ////
    req.session.authenticated = false;
    //解除後、topページへ
    req.logout();
    res.redirect('/');
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
