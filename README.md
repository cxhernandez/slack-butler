# slack-butler
An easily deployable webapp that automatically registers and invites users to your slack team

Use Case
---
[Slack](https://slack.com/) is a great tool for team communication, 
but it has the potential to become an even better community building tool.
Unfortunately, slack does not let new users sign up for a team right out 
of the box, but slack-butler offers you the ability host your own hassel-free 
signup page with automated invitiations. As is, the signup page uses 
[Google reCAPTCHA](https://www.google.com/recaptcha) to prevent spamming.
slack-butler also checks if the registrant's username or email has already been taken.

Inspiration
---
Credit goes to [@levelsio](https://levels.io/), who 
[originally posted](https://levels.io/slack-typeform-auto-invite-sign-ups/) 
about hosting a slack signup page using [Typeform](http://www.typeform.com/) and uncovering some 
undocumented API calls.

Things you'll need
---
 1. Admin priviledges on a slack team
 1. [Slack API token](https://api.slack.com)
 1. [Google reCAPTCHA keys](https://developers.google.com/recaptcha) 
 1. [Heroku](https://www.heroku.com/) account
 1. [`heroku-toolbelt`](https://toolbelt.heroku.com/)
 

Deployment on Heroku
---
Once you have cloned this repo and properly installed the `heroku-toolbelt`, 
you can execute the following commands:

```
heroku create slack-butler
heroku ps:scale web=1

heroku config:add BOT_NAME=[insert name of the bot]
heroku config:add BOT_ICON=[insert slack emoji code]
heroku config:add PRETTY_TEAM_NAME=[insert team name as you want it to appear]
heroku config:add TEAM_NAME=[insert slack team name]
heroku config:add SLACK_API_TOKEN=[insert slack api token]
heroku config:add CHANNEL_ID=[insert channel id]
heroku config:add RECAPTCHA_PRIVATE_KEY=[insert recaptcha private key]
heroku config:add RECAPTCHA_PUBLIC_KEY=[insert recaptcha public key]

git push heroku master
```

Endorsements
---
[Folding@home](https://folding.stanford.edu): http://fah-slackbot.herokuapp.com
