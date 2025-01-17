/* eslint-disable linebreak-style */
'use strict'

const fs = require('fs-extra')
const sqLite = require('sqlite-async')

module.exports = class Cv {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqLite.open(dbName)
			const sql = `CREATE TABLE IF NOT EXISTS cv (cvId INTEGER PRIMARY KEY AUTOINCREMENT,
						userID INTEGER,
						name TEXT,
						addressLine1 TEXT,
						addressLine2 TEXT,
						postcode TEXT,
						country TEXT,
						phoneNumber TEXT,
						summary TEXT,
						ref TEXT,
						careerObj TEXT,
						careerSum TEXT,
						workExperience TEXT,
						personalSkills TEXT,
						education TEXT,
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
				country: body.country,
				phoneNumber: body.phoneNumber,
				summary: body.summary,
				careerObj: body.careerObj,
				careerSum: body.careerSum,
				workExperience: body.workExperience ,
				personalSkills: body.personalSkills,
				education: body.education,
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
				sql = `UPDATE cv SET 
              				name='${cvData.name}', addressLine1='${cvData.addressLine1}',
					       	addressLine2='${cvData.addressLine2}', postcode='${cvData.postcode}',
					       	country='${cvData.country}', phoneNumber='${cvData.phoneNumber}' 
					   WHERE userID='${cvData.userID}'`
				await this.db.run(sql)
				return true
			} else {
				sql = `INSERT INTO cv(userID,name,addressLine1, addressLine2, postcode, country, phoneNumber) 
					   VALUES('${cvData.userID}','${cvData.name}',
					          '${cvData.addressLine1}','${cvData.addressLine2}',
					          '${cvData.postcode}','${cvData.country}',
					          '${cvData.phoneNumber}')`
				await this.db.run(sql)
				return true
			}
		} catch (err) {
			throw new Error('There is no cv data for editing.')
		}
	}

	async edit2(cvData) {
		try {
			const sql = `UPDATE cv SET 
								summary= '${cvData.summary}',
              				    careerOBj= '${cvData.careerObj}',
              					careerSum= '${cvData.careerSum}', 
              					workExperience='${cvData.workExperience}',
              					personalSkills='${cvData.personalSkills}',
								education='${cvData.education}',
								ref='${cvData.ref}'
						 WHERE userID='${cvData.userID}'`
			await this.db.run(sql)
			return true
		} catch (err) {
			throw new Error('There is no cv data for editing.')
		}
	}

	async uploadPicture(ID, path, name) {
		await fs.copy(path, `public/avatars/${name}`)
		let sql = `SELECT cvId FROM cv WHERE userID='${ID}';`
		const data = await this.db.get(sql)
		if (data) {
			sql = `UPDATE cv SET avatarName='${name}' WHERE cvId ='${data.cvId}'`
			await this.db.run(sql)
			return true
		} else {
			throw new Error('There is no cv record for given user id')
		}
	}

	async cvPull(userID) {
		try {
			if (userID.length === 0) throw Error('the param is missing')
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
				const sql = `SELECT * FROM cv WHERE userID = "${paramsID}";`
				return await this.db.get(sql)
			} else {
				return false
			}
		} catch (err) {
			throw err
		}
	}

	async getDataFromCv() {
		const sql = `SELECT 
       					summary, name, userID, avatarName 
					 FROM 
					    cv;`
		return await this.db.all(sql)
	}

	async search(cvName) {
		const sql = `SELECT 
       					name, summary, userID 
					 FROM 
						cv 
				     WHERE 
						upper(name)
					 LIKE 
						"%${cvName}%" 
					 OR 
						upper(summary) 
					 LIKE 
						upper ("%${cvName}%");`
		return await this.db.all(sql)
	}
}
