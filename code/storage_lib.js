var lib = require('./lib');

var config = {}

config.userchannelid = process.env.CHANNELUSERID;

function insert() {

}

function update() {

}

function remove() {

}

function getAll() {

}

function get(tbl_name, key) {

	return config.userchannelid;
}

function getMultiple() {

}

module.exports.insert = insert;
module.exports.update = update;
module.exports.remove = remove;
module.exports.getAll = getAll;
module.exports.get = get;
module.exports.getMultiple = getMultiple;