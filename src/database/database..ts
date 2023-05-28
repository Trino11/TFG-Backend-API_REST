const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
let uri = ``

function init(){
	uri = `mongodb://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBHOST}:${process.env.DBPORT}/?authMechanism=DEFAULT`
}

function getClient(){
	return new MongoClient(uri)
}

export {getClient, init};
