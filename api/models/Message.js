/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    body: {
      type: 'string',
      required: true
    },
  
    find: function(req, res) {
        console.log("GET /message");

        Message.find().exec(function(err, messages) {
            res.json(messages);
        });
    },

    create: function(req, res){
        console.log("POST /message");

        var text = req.param('text');

        Message.create({text: text}).exec(function(err, message) {
            res.json(message);
        });
    }
  }
};

