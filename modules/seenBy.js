'use strict'

const sqLite = require('sqlite-async')

module.exports = class SeenBy {

	constructor() {
		return (async() => {
			this.db = await sqLite.open('website.db')
			// eslint-disable-next-line max-len
			const sql = 'CREATE TABLE IF NOT EXISTS seen (seenID INTEGER PRIMARY KEY AUTOINCREMENT, cvID INTEGER, userSeen TEXT);'
			await this.db.run(sql)
			return this
		})()
	}

	async postSeenUsingCvIdAndUsername(cvId, username) {
		try {
			const sql = `INSERT INTO seen(cvID, userSeen) VALUES("${cvId}","${username}")`
			await this.db.run(sql)
			return true
		} catch (err) {
			throw err
		}
	}

	async getSeenUsingID(cvId) {
		try {
			const sql = `SELECT DISTINCT userSeen FROM seen WHERE cvID = ${cvId};`
			return await this.db.all(sql)
		} catch (err) {
			throw new Error('Can not get seen data with using user id.')
		}
	}
}


