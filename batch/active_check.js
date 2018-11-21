var webclient = require("request");
 
webclient.get({
  url: "http://localhost:1337/userList/checkAndDelete"
}, function (error, response, body) {
  console.log(body);
});