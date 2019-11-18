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
			let sql = `SELECT COUNT(userID) as records FROM cv WHERE userID='${userID}';`
			const data = await this.db.get(sql)
			if (data.records !== 0) {
				sql= `UPDATE cv SET name='${name}',address='${address}',summary='${summary}',details='${details}' WHERE userID='${userID}'`
				await this.db.run(sql)
				return true
			} else {
				sql=`INSERT INTO cv(userID,name,address,summary,details) VALUES('${userID}','${name}','${address}','${summary}','${details}')`
				await this.db.run(sql)
				return true
			}
		} catch(err) {
			throw err
		}
	}
	
	async cvPull(userID) {
		try {
			let sql = `SELECT COUNT(userID) as records FROM cv WHERE userID='${userID}';`
			let data = await this.db.get(sql)
			if (data.records !== 0) {
				sql= `SELECT * FROM cv WHERE userID = "${userID}";`
				data = await this.db.get(sql)
				return data
			} else{
				return false
			}
		} catch(err) {
			throw err
		}
	}

}
