/**
 * Created by KaiNguyen on 9/4/16.
 */



let basePath = 'https://slack.com'
	, $http = require('http')


module.exports = {
		get(path, params, cb) {
			return $http.sync.get(path, params, cb);
		}
}
