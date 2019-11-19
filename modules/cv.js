'use strict'

const sqlite = require('sqlite-async')

module.exports = class Cv {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store cv details whilst relating to user
			const sql = 'CREATE TABLE IF NOT EXISTS cv (cvId INTEGER PRIMARY KEY AUTOINCREMENT, userID INTEGER, name TEXT, addressLine1 TEXT, addressLine2 TEXT,postcode TEXT, county TEXT,country TEXT, summary TEXT, skills TEXT, refrences TEXT,usersWords TEXT, FOREIGN KEY(userID) REFERENCES users(id));'
			await this.db.run(sql)
			return this
		})()
	}

	async cvObj(id, body) {

		try{
			const cvData={
				userID: id,
				name: body.name,
				address: body.address,
				summary: body.summary,
				details: body.details
				
			}
			return cvData
		} catch(err) {
			throw err
		}
	}

	async edit(cvData) {
		try {
			let sql = `SELECT COUNT(userID) as records FROM cv WHERE userID='${cvData.userID}';`
			const data = await this.db.get(sql)
			if (data.records !== 0) {
				sql= `UPDATE cv SET name='${cvData.name}',address='${cvData.address}',summary='${cvData.summary}',details='${cvData.details}' WHERE userID='${cvData.userID}'`
				await this.db.run(sql)
				return true
			} else {
				sql=`INSERT INTO cv(userID,name,address,summary,details) VALUES('${cvData.userID}','${cvData.name}','${cvData.address}','${cvData.summary}','${cvData.details}')`
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
	};

}
