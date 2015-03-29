var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();
var engine = require('ejs-locals')
var port = process.env.PORT || 3000;

var slackTeamName = process.env.TEAM_NAME
var prettyTeamName = process.env.PRETTY_TEAM_NAME
var token = process.env.SLACK_API_TOKEN;
var recaptchaKey = process.env.RECAPTCHA_KEY;
var channelID = process.env.CHANNEL_ID;
var botName = process.env.BOT_NAME;
var icon = process.env.BOT_ICON;


var recaptcha_async = require('recaptcha-async')

app.use(bodyParser());
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.get('/', function (req, res, next) {

    res.render('index', {prettyTeamName: prettyTeamName
                        });

});

app.post('/', function(req, res, next){
  var recaptcha = new recaptcha_async.reCaptcha();

  var userName = req.body.userName;
  var email = req.body.email;
  var key = req.body.secret;

  var message;
  var color = 'red';

  recaptcha.on('data', function (recaptcha_response) {
    console.log(recaptcha_response.is_valid);
    console.log(next);
    if (false) {

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
        message = 'Sorry, you answered the recaptcha incorrectly.';
        color = 'red';
    };

    res.render('response', {
                          prettyTeamName: prettyTeamName,
                          message: message,
                          color: color
              });

  });

  recaptcha.checkAnswer(recaptchaKey,
                  req.connection.remoteAddress,
                  req.body.recaptcha_challenge_field,
                  req.body.recaptcha_response_field);

});



app.listen(port, function () {
    console.log('Slack bot listening on port ' + port);
});
