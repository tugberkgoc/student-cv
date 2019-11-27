/* eslint-disable linebreak-style */
'use strict'

const fs = require('fs-extra')
const mime = require('mime-types')
const sqLite = require('sqlite-async')

const dbName = 'website.db'

module.exports = class Cv {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqLite.open(dbName)
			// we need this table to store cv details whilst relating to user
			const sql = `CREATE TABLE IF NOT EXISTS cv (cvId INTEGER PRIMARY KEY AUTOINCREMENT,
						userID INTEGER,
						name TEXT,
						addressLine1 TEXT,
						addressLine2 TEXT,
						postcode TEXT,
						country TEXT,
						summary TEXT,
						skills TEXT,
						ref TEXT,
						usersWords TEXT,
						avatarName TEXT,
						FOREIGN KEY(userID) REFERENCES users(id));`
			await this.db.run(sql)
			return this
		})()
	}

	async cvObj(id, body) {
		try {
			return {
				userID: id,
				name: body.name,
				addressLine1: body.addressLine1,
				addressLine2: body.addressLine2,
				postcode: body.postcode,
				ref: body.references,
				usersWords: body.usersWords,
				country: body.country,
				skills: body.skills,
				summary: body.summary
			}
		} catch (err) {
			throw new Error('There is no id and body.')
		}
	}

	async edit(cvData) {
		try {
			let sql = `SELECT COUNT(userID) as records FROM cv WHERE userID='${cvData.userID}';`
			const data = await this.db.get(sql)
			if (data.records !== 0) {
				// eslint-disable-next-line max-len
				sql = `UPDATE cv SET name='${cvData.name}',addressLine1='${cvData.addressLine1}',addressLine2='${cvData.addressLine2}',postcode='${cvData.postcode}',country='${cvData.country}', skills='${cvData}', ref='${cvData.ref}',summary='${cvData.summary}' WHERE userID='${cvData.userID}'`
				await this.db.run(sql)
				return true
			} else {
				// eslint-disable-next-line max-len
				sql = `INSERT INTO cv(userID,name,addressLine1, addressLine2, postcode, country, skills, ref, summary) VALUES('${cvData.userID}','${cvData.name}','${cvData.addressLine1}','${cvData.addressLine2}','${cvData.postcode}','${cvData.country}','${cvData.skills}','${cvData.ref}','${cvData.summary}')`
				await this.db.run(sql)
				return true
			}
		} catch (err) {
			throw new Error('There is no cv data for editing.')
		}
	}

	async uploadPicture(ID, path, name, mimeType) {
		const extension = mime.extension(mimeType)
		console.log(`path: ${path}`)
		console.log(`extension: ${extension}`)
		await fs.copy(path, `public/avatars/${name}`)
		let sql = `SELECT cvId FROM cv WHERE userID='${ID}';`
		const data = await this.db.get(sql)
		if (data.records !== 0) {
			sql = `UPDATE cv SET avatarName='${name}' WHERE cvId ='${data.cvId}'`
			await this.db.run(sql)
			return true
		}
	}

	async cvPull(userID) {
		try {
			if(userID.length === 0) throw Error('the param is missing')
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
	}

	async getCVUsingUserID(id) {
		try {
			if (id !== 0) {
				const sql = `SELECT * FROM cv WHERE userID = ${id};`
				return await this.db.get(sql)
			} else {
				return false
			}
		} catch (err) {
			throw new Error('Can not get cv data.')
		}
	}

	async getDataUsingParamsID(paramsID) {
		try {
			if (paramsID.length === 0) throw new Error('Can not get data from cv.')
			if (paramsID !== 0) {
				const db = await sqLite.open(dbName)
				const sql = `SELECT * FROM cv WHERE userID = "${paramsID}";`
				const cvData = await db.get(sql)
				await db.close()
				return cvData
			} else {
				return false
			}
		} catch (err) {
			throw err
		}
	}

	async getDataFromCv() {
		try{
			const sql = 'SELECT summary, name, userID, avatarName FROM cv '
			const db = await sqLite.open(dbName)
			const summary = await db.all(sql)
			await db.close()
			return summary
		}catch(err) {
			throw new Error('Cannot get data from cv.')
		}
	}


}

