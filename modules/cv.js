'use strict'

const sqlite = require('sqlite-async')

module.exports = class Cv {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store cv details whilst relating to user
			const sql = 'CREATE TABLE IF NOT EXISTS cv (cvId INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, address TEXT, summary TEXT, details TEXT);'
			await this.db.run(sql)
			return this
		})()
	}
	async edit(name,address,summary,details) {
		try {
			const sql=`INSERT INTO cv(name,address,summary,details) VALUES('${name}','${address}','${summary}','${details}')`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

}
