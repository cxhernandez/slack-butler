var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();
var port = process.env.PORT || 3000;

var slackTeamName = process.env.TEAM_NAME
var prettyTeamName = process.env.PRETTY_TEAM_NAME
var token = process.env.SLACK_API_TOKEN;
var secret = process.env.SECRET_KEY;
var channelID = process.env.CHANNEL_ID;
var botName = process.env.BOT_NAME;
var icon = process.env.BOT_ICON;

app.use(bodyParser());

app.get('/', function (req, res) { 

    var html =  '<head>' +
                '<meta charset="utf-8">' +
                '<meta http-equiv="X-UA-Compatible" content="IE=edge">' +
                '<meta name="viewport" content="width=device-width, initial-scale=1">' + 
                '<title>Sign up for the ' + prettyTeamName +  ' Slack Team</title>' +
                '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">' +
                '<link rel="stylesheet" href="http://getbootstrap.com/examples/signin/signin.css">' +
                '</head>' +
                '<div class="container" >' +
                '<h1 class="form-signin-heading" align="center">Join the ' + prettyTeamName + '<br>Slack Team</h1>' +
                '<form class="form-signin" action="/" method="post">'+
                   '<h4 class="form-signin-heading">Please fill in your information: </h4>' +
                   '<label for="userName" class="sr-only">Username</label>'+
                   '<input type="text" name="userName" id="userName" class="form-control" placeholder="username" required="" autofocus="">' +
                   '<br>' +
                   '<label for="email" class="sr-only">Email address</label>'+
                   '<input type="text" name="email" id="email" class="form-control" placeholder="email address" required="" autofocus="">' +
                   '<br>' +
                   '<label for="secret" class="sr-only">Secret Key</label>'+
                   '<input type="password" name="secret" id="secret" class="form-control" placeholder="secret key" required="" autofocus="">' +
                  '<button class="btn btn-lg btn-primary btn-block" type="submit">Sign Up</button>' +
                '</form>' +
                '</div>';

    res.send(html);

});

app.post('/', function(req, res){
    var userName = req.body.userName;
    var email = req.body.email;
    var key = req.body.secret;

    var message;
    var color = 'red';

    if (secret == key ) {
               
        request({
            uri: 'https://' + slackTeamName + '.slack.com/api/users.admin.invite?' + 
                 't=' + (new Date).getTime() + 
                 '&token=' + token + 
                 '&email=' + encodeURIComponent(email) +
                 '&set_active=' + encodeURIComponent('true') +
                 '&_attempts=' + "1",
            method: 'post'
        });

        message = 'Thanks ' + userName + '! You should receive an email shortly.'; 
        color = 'green';

        request({
            uri:  'https://slack.com/api/chat.postMessage?' + 
                  '&token=' + token + 
                  '&channel=' + encodeURIComponent(channelID) +
                  '&username=' + encodeURIComponent(botName) +
                  '&text=' + encodeURIComponent(userName + ' has requested to join the ' + prettyTeamName + ' team.') +
                  '&icon_emoji=' + encodeURIComponent(icon),
            method: 'post',

       });

    } else {
        message = 'Sorry, your secret key was incorrect.';
        color = 'red';
    };
    var html =  '<head>' +
                '<meta charset="utf-8">' +
                '<meta http-equiv="X-UA-Compatible" content="IE=edge">' +
                '<meta name="viewport" content="width=device-width, initial-scale=1">' + 
                '<title>Folding@home Slack</title>' +
                '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">' +
                '<link rel="stylesheet" href="http://getbootstrap.com/examples/signin/signin.css">' +
                '</head>' +
                '<div class="container" >' +
                '<h2 style="color:' + color + ';">' + message + '</h2>' +
                '</div>';

    res.send(html)
});

app.listen(port, function () {
    console.log('Slack bot listening on port ' + port);
});
