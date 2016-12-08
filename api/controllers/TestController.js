/**
 * TestController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    index: function(req, res) {
        return res.view('test/index', {
            name: 'tarou'
        });
    },
    test: function(req, res) {
        User.find().exec(function (err, records) {
            return res.view('test/test', {hello : 'hello', users : records});
        });
    },
    create: function(req, res) {
        var name = req.param('name');

        User.create({name: name}).exec(function (err, message) {
            if (!err) {
                User.find().exec(function (err, records) {
                    return res.view('test/test', {hello : 'hello', users : records});
                });
            } else {
                return res.view('error', {message : message});
            }
        });
    }
}

