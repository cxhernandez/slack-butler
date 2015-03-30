var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var https = require('https');
var engine = require('ejs-locals')

var app = express();

var port = process.env.PORT || 3000;

var slackTeamName = process.env.TEAM_NAME
var prettyTeamName = process.env.PRETTY_TEAM_NAME
var token = process.env.SLACK_API_TOKEN;
var privateCAPTCHAKey = process.env.RECAPTCHA_PRIVATE_KEY;
var publicCAPTCHAKey = process.env.RECAPTCHA_PUBLIC_KEY;
var channelID = process.env.CHANNEL_ID;
var botName = process.env.BOT_NAME;
var icon = process.env.BOT_ICON;


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


app.get('/', function (req, res, next) {

    res.render('index', {
                          prettyTeamName: prettyTeamName,
                          publicCAPTCHAKey: publicCAPTCHAKey
                        });

});

app.post('/', function(req, res, next){

  var userName = req.body.userName;
  var email = req.body.email;
  var key = req.body.secret;

  var message;
  var color = 'red';
  console.log(req.body['g-recaptcha-response']);
  verifyRecaptcha(req.body["g-recaptcha-response"], function(response) {
        if (response.success) {

          message = 'Thanks ' + userName + '! You should receive an email shortly.';
          color = 'green';

          request({
              uri: 'https://' + slackTeamName + '.slack.com/api/users.admin.invite?' +
                   't=' + (new Date).getTime() +
                   '&token=' + token +
                   '&email=' + encodeURIComponent(email) +
                   '&set_active=' + encodeURIComponent('true') +
                   '&_attempts=' + "1",
              method: 'post'
          });



          request({
              uri:  'https://slack.com/api/chat.postMessage?' +
                    '&token=' + token +
                    '&channel=' + encodeURIComponent(channelID) +
                    '&username=' + encodeURIComponent(botName) +
                    '&text=' + encodeURIComponent(userName + ' has requested to join the ' + prettyTeamName + ' team.') +
                    '&icon_emoji=' + encodeURIComponent(icon),
              method: 'post',

         });


        } else{

          color = 'red';

          if (response['error-codes'] == 'missing-input-response') {

            message = 'Please answer the CAPTCHA and try again.';

          } else{

            message = 'Sorry, something went wrong. Please try again.';

          }


        }
          res.render('response', {
                                prettyTeamName: prettyTeamName,
                                message: message,
                                color: color
                    });

  });

});



app.listen(port, function () {
    console.log('Slack bot listening on port ' + port);
});
