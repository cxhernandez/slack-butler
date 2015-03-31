var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var https = require('https');
var engine = require('ejs-locals')

var port = process.env.PORT || 3000;

var slackTeamName = process.env.TEAM_NAME
var prettyTeamName = process.env.PRETTY_TEAM_NAME
var token = process.env.SLACK_API_TOKEN;
var privateCAPTCHAKey = process.env.RECAPTCHA_PRIVATE_KEY;
var publicCAPTCHAKey = process.env.RECAPTCHA_PUBLIC_KEY;
var channelID = process.env.CHANNEL_ID;
var botName = process.env.BOT_NAME;
var icon = process.env.BOT_ICON;

var app = express();
app.use(bodyParser());
app.engine('ejs', engine);
app.set('view engine', 'ejs');

function verifyRecaptcha(response, callback) {
    https.get("https://www.google.com/recaptcha/api/siteverify?secret=" + privateCAPTCHAKey + "&response=" + response, function(res) {
        var data = "";
        res.on('data', function (chunk) {
            data += chunk.toString();
        });
        res.on('end', function() {
            try {
                var parsedData = JSON.parse(data);
                callback(parsedData);
            } catch (e) {
                callback(false);
            }
        });
    });
}

function verifyCredentials(user, email, res) {
     req = request({
            uri: 'https://' + slackTeamName + '.slack.com/api/users.list?' +
            'token=' + token +
            '&pretty=1',
            method: 'post',
            }, function(error, response, body) {
                if (error){
                    console.log(error)
                    return renderMessage(res, 'Something went wrong. Please try again.', 'red');
                } else {
                    var json = JSON.parse(body);
                    var members = json['members'];
                    for (var i in members) {
                        if (members[i]['name'] == user || members[i]['profile']['email'] == email) {
                            return renderMessage(res, 'That username or email has already been taken. Please try again.', 'red');
                        }
                    }
                }
                return announce(user, email, res);
          });
}

function renderMessage(res, message, color) {
    res.render('response', {
                            prettyTeamName: prettyTeamName,
                            message: message,
                            color: color
            });
}

function announce(user, email, res) {
   request({
      uri: 'https://' + slackTeamName + '.slack.com/api/users.admin.invite?' +
           't=' + (new Date).getTime() +
           '&token=' + token +
           '&email=' + encodeURIComponent(email) +
           '&set_active=' + encodeURIComponent('true') +
           '&_attempts=' + "1",
      method: 'post'
      }, function(error, response){
            if (error) {
                console.log(error)
                renderMessage(res, 'Something went wrong. Please try again.', 'red');
            } else {
                renderMessage(res, 'Thanks ' + user + '! You should receive an email shortly.', 'green');
            }
      });

  request({
      uri:  'https://slack.com/api/chat.postMessage?' +
            '&token=' + token +
            '&channel=' + encodeURIComponent(channelID) +
            '&username=' + encodeURIComponent(botName) +
            '&text=' + encodeURIComponent(user + ' has requested to join the ' + prettyTeamName + ' team.') +
            '&icon_emoji=' + encodeURIComponent(icon),
      method: 'post',
    });
   
}

app.get('/', function (req, res, next) {
    res.render('index', {
                          prettyTeamName: prettyTeamName,
                          publicCAPTCHAKey: publicCAPTCHAKey
        });
});

app.post('/', function(req, res, next){
  var user = req.body.userName;
  var email = req.body.email;
  verifyRecaptcha(req.body["g-recaptcha-response"], function(response) {
        if (response.success) {
            verifyCredentials(user, email, res);
        } else{
          if (response['error-codes'] == 'missing-input-response') {
            renderMessage(res, 'Please answer the CAPTCHA and try again.', 'red');
          } else{
            console.log(response);
            renderMessage(res, 'Something went wrong. Please try again.', 'red');
          }
        }
  });
});

app.listen(port, function () {
    console.log('Slack bot listening on port ' + port);
});
