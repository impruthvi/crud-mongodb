// 1.Import
const { MongoClient } = require('mongodb');
// 2.DB initialization
const databaseName = 'hupp-task';
// 3.DB URL
const url = "mongodb://localhost:27017";
//4.connect mongodb
const client = new MongoClient(url);

const dbConnect = async(tableName) => {
    // Connection
    let result = await client.connect();
    // Connection with db
    let db = result.db(databaseName);
    // get collection to connect
    return db.collection(tableName);
    // Get response

}

module.exports = dbConnect;