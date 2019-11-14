'use strict'

const sqlite = require('sqlite-async')

module.exports = class Cv {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store cv details whilst relating to user
			const sql = 'CREATE TABLE IF NOT EXISTS cv (cvId INTEGER PRIMARY KEY AUTOINCREMENT, userID INTEGER, name TEXT, address TEXT, summary TEXT, details TEXT, FOREIGN KEY(userID) REFERENCES users(id));'
			await this.db.run(sql)
			return this
		})()
	}
	async edit(userID, name, address, summary, details) {
		try {
			const sql=`INSERT INTO cv(userID,name,address,summary,details) VALUES('${userID}','${name}','${address}','${summary}','${details}')`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

}
