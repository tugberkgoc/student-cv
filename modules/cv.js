'use strict'

const fs = require('fs-extra')
const mime = require('mime-types')
const sqlite = require('sqlite-async')

module.exports = class Cv {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store cv details whilst relating to user
			// eslint-disable-next-line max-len
			const sql = 'CREATE TABLE IF NOT EXISTS cv (cvId INTEGER PRIMARY KEY AUTOINCREMENT, userID INTEGER, name TEXT, addressLine1 TEXT, addressLine2 TEXT,postcode TEXT, county TEXT,country TEXT, summary TEXT, skills TEXT, refrences TEXT,usersWords TEXT, avatarName  TEXT, FOREIGN KEY(userID) REFERENCES users(id));'
			await this.db.run(sql)
			return this
		})()
	}

	async cvObj(id, body) {
		try {
			return {
				userID: id,
				name: body.name,
				addressLine1: body.address,
				summary: body.summary
			}
		} catch (err) {
			throw err
		}
	}

	async edit(cvData) {
		try {
			let sql = `SELECT COUNT(userID) as records FROM cv WHERE userID='${cvData.userID}';`
			const data = await this.db.get(sql)
			if (data.records !== 0) {
				// eslint-disable-next-line max-len
				sql = `UPDATE cv SET name='${cvData.name}',addressLine1='${cvData.addressLine1}',summary='${cvData.summary}' WHERE userID='${cvData.userID}'`
				await this.db.run(sql)
				return true
			} else {
				// eslint-disable-next-line max-len
				sql = `INSERT INTO cv(userID,name,addressLine1,summary) VALUES('${cvData.userID}','${cvData.name}','${cvData.addressLine1}','${cvData.summary}')`
				await this.db.run(sql)
				return true
			}
		} catch (err) {
			throw err
		}
	}

	async uploadPicture(ID, path, name, mimeType) {
		const extension = mime.extension(mimeType)
		console.log(`path: ${path}`)
		console.log(`extension: ${extension}`)
		await fs.copy(path, `public/avatars/${name}`)
		let sql = `SELECT cvId FROM cv WHERE userID='${ID}';`
		const data = await this.db.get(sql)
		if (data.cvId !== 0) {
			sql = `UPDATE cv SET avatarName='${name}' where cvId='${data.cvId}';`
			await this.db.run(sql)
			return true
		}
	}

	async cvPull(userID) {
		try {
			let sql = `SELECT COUNT(userID) as records FROM cv WHERE userID='${userID}';`
			let data = await this.db.get(sql)
			if (data.records !== 0) {
				sql = `SELECT * FROM cv WHERE userID = "${userID}";`
				data = await this.db.get(sql)
				return data
			} else {
				return false
			}
		} catch (err) {
			throw err
		}
	};

}
