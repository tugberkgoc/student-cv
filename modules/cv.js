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
			const sql = 'CREATE TABLE IF NOT EXISTS cv (cvId INTEGER PRIMARY KEY AUTOINCREMENT, userID INTEGER, name TEXT, addressLine1 TEXT, addressLine2 TEXT,postcode TEXT,country TEXT, summary TEXT, skills TEXT, references TEXT, usersWords TEXT, avatarName TEXT, FOREIGN KEY(userID) REFERENCES users(id));'
			await this.db.run(sql)
			return this
		})()
	}

	async cvObj(id, body) {

        try{
            const cvData={
                userID: id,
                name: body.name,
                addressLine1: body.addressLine1,
                addressLine2: body.addressLine2,
                postcode: body.postcode,
                references: body.references,
				usersWords: body.usersWords,
				country: body.country,
                skills: body.skills,
                summary: body.summary
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
                sql= `UPDATE cv SET name='${cvData.name}',addressLine1='${cvData.addressLine1}',addressLine2='${cvData.addressLine2}',postcode='${cvData.postcode}',country='${cvData.country}',references='${cvData.references}',summary='${cvData.summary}' WHERE userID='${cvData.userID}'`
                await this.db.run(sql)
                return true
            } else {
                sql=`INSERT INTO cv(userID,name,addressLine1, addressLine2, postcode, country, references, usersWords, summary) VALUES('${cvData.userID}','${cvData.name}','${cvData.addressLine1}','${cvData.addressLine2}','${cvData.postcode}','${cvData.country}','${cvData.references}','${cvData.summary}')`
                await this.db.run(sql)
                return true
            }
        } catch(err) {
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
			if (data.records !== 0) {
				sql= `UPDATE cv SET avatarName='${name}' WHERE cvId ='${data.cvId}'`
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

