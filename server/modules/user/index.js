/**
 * Created by KaiNguyen on 9/3/16.
 */

const mongoose = require('mongoose');
//const organize = require('../organize');

var async = require('asyncawait/async');
var await = require('asyncawait/await');
var _ = require('lodash');

const fibrous = require('fibrous');


var Schema = mongoose.Schema;
// create a schema
let user = new Schema({
	typeId: Number,
	id: String,
	team_id: String,
	deleted: Boolean,
	status: Schema.Types.ObjectId,
	name: String,
	real_name: String,
	profile: Schema.Types.Mixed,
	tz: String,
	tz_offset: String,
	isAdmin: Boolean,
	is_owner: Boolean,
	is_primary_owner: Boolean,
	is_restricted: Boolean,
	is_ultra_restricted: Boolean,
	is_bot: Boolean,
	presence: String,
	bday: Date,
});

const emitter = require('../../eventsEmitter.js');

emitter.on('user:create', (teamId, member) => {
	console.log('on create user', teamId);
	fibrous.run(()=> {
		if (!member || !teamId)
			return;

		let user = User.sync.findOne({
			id: member.id,
			team_id: teamId
		});

		if (!user)
			user = new User(member);
		else
			_.extend(user, member);

		user.typeId = 1;
		user.save();
	})
});


user.static('findMe', async(function (teamId, userId) {
	console.log('teamId, userId)', teamId, userId);

	let user = await(this.findOne({id: userId, team_id: teamId}));
	return JSON.stringify(user);
}));

user.static('setupTeamUsers', async(function (teamId, members) {
	if (!members)
		return;

	let syncUsers = await(this.find({team_id: teamId}).count());
	if (syncUsers == members.length)
		return;

	members.forEach((member)=> {
		let user = await(this.findOne({
			id: member.id,
			team_id: teamId
		}));

		if (!user)
			user = new User(member);
		else
			_.extend(user, member);

		user.typeId = 1;
		user.save();
	});
}));

let User = mongoose.model('user', user);

module.exports = User;