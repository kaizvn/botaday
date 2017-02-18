/**
 * Created by KaiNguyen on 9/3/16.
 */


const fs = require('fs')
	, express = require('express')
	, bodyParser = require('body-parser')
	, mongoose = require('mongoose')
	, webpack = require('webpack')
	, webpackConfig = require('../webpack.config.js')
	, settings = require(__dirname + '/config/dev.js')
	, user = require(__dirname + '/modules/user')
	, slackBot = require(__dirname + '/bots/slack');


var Fibrous = require('fibrous');

class fibrous extends Fibrous {
}

mongoose.connect('mongodb://localhost/slackbot');

// Set the client credentials and the OAuth2 server
var credentials = {
	clientID: '44112638790.76111810213',
	clientSecret: '24003f93641eee7db1a496db8040b8ea',
	site: 'https://slack.com',
	authorizationPath: '/oauth/authorize',
	tokenPath: '/api/oauth.access',
	revocationPath: '/api/auth.revoke'
};

// Initialize the OAuth2 Library
const botDir = __dirname + '/bots';
var oauth2 = require('simple-oauth2')(credentials);

webpack(webpackConfig, ()=> console.log('start webpack'));

/*fs.readdirSync(botDir).forEach((name)=>
 require([botDir, name].join('/'))(settings.bots[name])
 );*/

const app = new express();

var token;
var tokenConfig = {
	code: '',
	redirect_uri: 'https://69f30e39.ngrok.io/callback'
};

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(fibrous.middleware);


app.get('/', function (req, res) {
	res.send('Hello<br><a href="/auth">Log in with Github</a>');
});

app.get('/callback', (req, res)=> {
	console.log('req', req.query);
	tokenConfig.code = req.query.code;
	console.log('tokenConfig', tokenConfig);
	let result = oauth2.authCode.sync.getToken(tokenConfig);
	if (result) {
		/*token = oauth2.accessToken.create(result);
		 console.log('token', token);*/
		console.log('result', result);
		let settings = {
			token: result.bot.bot_access_token,
			//name: 'bdaybot'
		};
		//create boot
		new slackBot(settings);
	}
	else
		console.log('Access Token Error', error.message);

	res.sendStatus(200);
});

app.listen(4000, ()=> console.log('hellloworld'));
