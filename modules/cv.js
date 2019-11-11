'use strict'
const sqlite = require('sqlite-async')

module.exports = class Cv {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store cv details whilst relating to user
			const sql = `CREATE TABLE IF NOT EXISTS cv (cv_id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER,
            firstName TEXT, lastName TEXT, adress TEXT, summary TEXT, details TEXT  FOREIGN KEY(userId) REFERENCES users (id));`
			await this.db.run(sql)
			return this
		})()
    }
    
    async edit(userId,firstName,lastName,adress,summary,details) {
        try {

        } catch(err) {
            throw err
        }
    }

}