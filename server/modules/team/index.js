/**
 * Created by KaiNguyen on 9/4/16.
 */


const mongoose = require('mongoose');

var async = require('asyncawait/async');
var await = require('asyncawait/await');
const emitter = require('../../eventsEmitter.js');

const fibrous = require('fibrous');

var Schema = mongoose.Schema;
// create a schema
let team = new Schema({
	typeId: Number,
	name: String,
	domain: String,
	id: String,
	plan: String,
	over_storage_limit: Boolean,
	icon: Schema.Types.Mixed,
	prefs: Schema.Types.Mixed,
	email_domain: String
});

emitter.on('team:create', (teamObj) => {
	fibrous.run(()=> {
		let team = Team.sync.findOne({id: teamObj.id});
		if (!team)
			team = new Team(teamObj);

		team.typeId = 1;
		team.save();
	})

});


team.static('setupTeam', function (teamObj) {
	console.log('here');
	let team = this.findOne({id: teamObj.id}).exec();

	if (!team)
		team = new Team(teamObj);

	team.typeId = 1;
	team.save();

	return team.id;
});

let Team = mongoose.model('team', team);

module.exports = Team;