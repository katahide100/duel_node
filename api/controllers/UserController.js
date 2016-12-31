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
     }
};

