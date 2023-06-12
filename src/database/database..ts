const { MongoClient } = require("mongodb");

let uri = ``

function init(){
	uri = `mongodb://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBHOST}:${process.env.DBPORT}/?authMechanism=DEFAULT`
}

function getClient(){ //Creates a MongoClient
	return new MongoClient(uri)
}

export {getClient, init};
