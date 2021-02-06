//var webclient = require("request");
 
//webclient.get({
//  url: "https://manadream.net:1337/userList/checkAndDelete"
//}, function (error, response, body) {
//  console.log(error);
//  console.log(response);
//  console.log(body);
//});

var request = require('request');

var options = {
    url: 'https://manadream.net:1337/userList/checkAndDelete',
    method: 'GET',
strictSSL: false
};

request(options, function (error, response, body) {
//  console.log(error);
//  console.log(response);

  console.log(body);
});
