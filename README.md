# slack-butler
Easily deployable webapp that automatically invites users to your slack team

Use Case
---
[slack](https://slack.com/) is a great tool for team communication, 
but it has the potential to become an even better community building tool.
Unfortunately, slack does not let new users sign up for a team right out 
of the box, but slack-butler offers you the ability host your own hassel-free signup page.
As is, the signup page requires a user to provide a pre-determined 'secret key' to 
prevent spamming, but future versions might include a CAPTCHA instead.

Inspiration
---
Credit goes to [@levelsio](https://levels.io/), who [originally posted](https://levels.io/slack-typeform-auto-invite-sign-ups/) 
about hosting a slack signup page using [Typeform](http://www.typeform.com/) and uncovering some 
undocumented API calls.

Things you'll need
---
 1. Admin priviledges on a slack team
 1. [slack API token](api.slack.com)
 1. [Heroku](https://www.heroku.com/) account
 1. [`heroku-toolbelt`](https://toolbelt.heroku.com/)
 

Deployment on Heroku
---
Once you have cloned this repo and properly installed the `heroku-toolbelt`, 
you can execute the following commands:

```
heroku create slack-butler
heroku ps:scale web=1

heroku config:add SLACK_API_TOKEN=[insert api token]
heroku config:add TEAM_NAME=[insert slack team name]
heroku config:add CHANNEL_ID=[insert channel id] // channel where slack-butler will announce new users 
heroku config:add SECRET_KEY=[insert secret key] // completely arbitrary

git push heroku master
```
