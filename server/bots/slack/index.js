/**
 * Created by KaiNguyen on 9/3/16.
 */

const Bot = require('slackbots');
const User = require('../../modules/user');
const Team = require('../../modules/team');
const mongoose = require('mongoose');

const async = require('asyncawait/async');
const await = require('asyncawait/await');
const _ = require('lodash');

const emitter = require('../../eventsEmitter.js');

class bot extends Bot {
}


console.log('emitter', emitter);

const botEvents = {
	start(bot){
		console.log('startbot');
		if (!this.users)
			return;

		try {
			//setup the team
			emitter.emit('team:create', this.team);

			// setup user of team
			if (this.users.length)
				this.users.forEach((user)=> {
					// should validate bot (app's bot and other bot) and users
					emitter.emit('user:create', this.team.id, user)
				});
		} catch (e) {
			console.error(e);
		}

		bot.postMessageToUser('kai', 'hello bro!', null, null);
	},

	message(bot, data){
		if (data.type === 'message' && data.text && !data.bot_id) {
			switch (data.text) {
				case 'me':
					console.log('me');
					User.findMe(data.team, data.user).then((msg)=> {
						bot.postMessage(data.channel, "```" + msg + "```", {as_user: false});
					});
					break;
				default:
					bot.postMessage(data.channel, 'undefault', {as_user: true});
					break;
			}
		}
	}
};

class slackBot {
	bot() {
		return this._bot;
	}

	constructor(settings) {
		if (!settings.token)
			return console.error('missing token.');
		//!settings.name && (settings.name = 'botaday');

		this._bot = new bot(settings);
		_.each(botEvents, (cb, name)=> this.addEvent(cb, name));
	}

	addEvent(cb, name) {
		this._bot.on(name, (...args) => {
			cb(this.bot(), ...args);
		});
	}
}

module.exports = slackBot;
