/* eslint-disable linebreak-style */
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
			if (cvId.length === 0) throw new Error('missing parameter cvId')
			if (username.length === 0) throw new Error('missing parameter username')
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
			const getViewer = await this.db.all(sql)
			return getViewer

		} catch (err) {
			throw new Error('Can not get seen data with using user id.')
		}
	}
}


