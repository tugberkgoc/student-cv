'use strict'

const bcrypt = require('bcrypt-promise')
const fs = require('fs-extra')
const mime = require('mime-types')
const sqlite = require('sqlite-async')
const saltRounds = 10

const dbName = 'website.db'
module.exports = class User {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// eslint-disable-next-line max-len
			const sql = 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, email TEXT, pass TEXT, phoneNumber TEXT);'
			await this.db.run(sql)
			return this
		})()
	}

	async register(user, email, phoneNumber, pass) {
		try {
			if (user.length === 0) throw new Error('missing username')
			if (email.length === 0) throw new Error('missing email')
			if (pass.length === 0) throw new Error('The password is missing.')
			if (phoneNumber.length === 0) throw new Error('Missing Phone Number')
			if (phoneNumber.length < 11 || phoneNumber.length >11 ) throw new Error('Phone Number Invalid (length 11)')
			if (pass.length < 6) throw new Error('password is too short')
			let sql = `SELECT COUNT(id) as records FROM users WHERE user="${user}";`
			const data = await this.db.get(sql)
			if (data.records !== 0) throw new Error(`username "${user}" already in use`)
			pass = await bcrypt.hash(pass, saltRounds)
			sql = `INSERT INTO users(user, email, phoneNumber, pass) VALUES("${user}","${email}","${phoneNumber}","${pass}")`
			await this.db.run(sql)
			return true
		} catch (err) {
			throw err
		}
	}

	async uploadPicture(path, name, mimeType) {
		const extension = mime.extension(mimeType)
		console.log(`path: ${path}`)
		console.log(`extension: ${extension}`)
		await fs.copy(path, `public/avatars/${name}`)
	}

	async login(username, password) {
		try {
			let sql = `SELECT count(id) AS count FROM users WHERE user="${username}";`
			const records = await this.db.get(sql)
			if (!records.count) throw new Error(`Username "${username}" not found`)
			sql = `SELECT id, pass FROM users WHERE user = "${username}";`
			const record = await this.db.get(sql)
			const valid = await bcrypt.compare(password, record.pass)
			if (valid === false) throw new Error(`Invalid password for account "${username}"`)
			return record.id
		} catch (err) {
			throw err
		}
	};


	async getDataUsersUsingID(id){
		let db = await sqlite.open(dbName)
		const sql = `SELECT * FROM users WHERE id ="${id}";`
		const userData = await db.get(sql)
		await db.close()
		return userData
	}
}
