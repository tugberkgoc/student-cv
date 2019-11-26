'use strict'

const sqlite = require('sqlite-async')
const dbName = 'website.db'


module.exports = class SeenBy{

    constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// eslint-disable-next-line max-len
			const sql = 'CREATE TABLE IF NOT EXISTS seen (seenID INTEGER PRIMARY KEY AUTOINCREMENT, cvID INTEGER, userSeen TEXT);'
			await this.db.run(sql)
			return this
		})()
	}

    async seenPullData(cvID,userSeen){
        try {
			let sql = `SELECT COUNT(seenID) as records FROM seen WHERE userSeen="${userSeen}";`
			const data = await this.db.get(sql)
			if (data.records !== 0){
                sql = `UPDATE seen SET userSeen = "${userSeen}"`
            }// throw new Error(`username "${userSeen}" already in use`)
            sql = `INSERT INTO seen(cvID, userSeen) VALUES("${cvID}","${userSeen}")`
			await this.db.run(sql)
			return true
		} catch (err) {
			throw err
		}
	}


	async getSeensUsingID(id){
	 	const db = await sqlite.open(dbName)
		const sql = `SELECT * FROM seen WHERE cvID = "${id}";`
		const seenData = await db.all(sql)
		await db.close()
		return seenData
	}
}


