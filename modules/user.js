/* eslint-disable linebreak-style */
'use strict'

const saltRounds = 10
const sqLite = require('sqlite-async')
const bcrypt = require('bcrypt-promise')
const nodeMailer = require('nodemailer')

require('dotenv').config()

module.exports = class User {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqLite.open(dbName)
			// eslint-disable-next-line max-len
			const sql = 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, email TEXT, pass TEXT, phoneNumber TEXT);'
			await this.db.run(sql)
			return this
		})()
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
	}

	// eslint-disable-next-line complexity,max-lines-per-function
	async register(user, email, phoneNumber, pass) {
		try {
			if (user.length === 0) throw new Error('missing username')
			if (email.length === 0) throw new Error('missing email')
			if (pass.length === 0) throw new Error('The password is missing.')
			if (phoneNumber.length === 0) throw new Error('Missing Phone Number')
			// eslint-disable-next-line no-magic-numbers
			if (phoneNumber.length < 11 || phoneNumber.length > 11) throw new Error('Phone Number Invalid (length 11)')
			// eslint-disable-next-line no-magic-numbers
			if (pass.length < 6) throw new Error('password is too short')
			let sql = `SELECT COUNT(id) as records FROM users WHERE user="${user}";`
			const data = await this.db.get(sql)
			if (data.records !== 0) throw new Error(`username "${user}" already in use`)
			pass = await bcrypt.hash(pass, saltRounds)
			// eslint-disable-next-line max-len
			sql = `INSERT INTO users(user, email, phoneNumber, pass) VALUES("${user}","${email}","${phoneNumber}","${pass}")`
			await this.db.run(sql)
			return true
		} catch (err) {
			throw err
		}
	}

	async getUserUsingID(id) {
		try {
			if (id.length === 0) throw new Error('missing parametere')
			const sql = `SELECT * FROM users WHERE id ="${id}";`
			return await this.db.get(sql)
		} catch (err) {
			throw err
		}
	}

	async getUserEmailWithUsingId(id) {
		try {
			const sql = `SELECT email FROM users WHERE id=${id};`
			return await this.db.get(sql)
		} catch (err) {
			throw new Error('Can not user email with using user id.')
		}
	}

	async sendEmail(fromEmail, toEmail, body) {
		try {
			const mailOption = this.emailSetup(fromEmail, toEmail, body)
			const transporter = nodeMailer.createTransport({
				service: 'gmail',
				auth: {
					user: process.env.EMAIL,
					pass: process.env.PASSWORD
				}
			})
			await transporter.sendMail(mailOption)
			return true
		} catch (err) {
			throw new Error('There is an error occurred, when send an email.')
		}
	}


	emailSetup(emailFrom, emailTo, data) {
		const output = `
	<p>You have a new contact request.</p>
		<h3>Contact Details</h3>
		<ul>
			<li>Name: ${data.name}</li>  
			<li>Company: ${data.company}</li>
			<li>Email: ${emailFrom}</li>
			<li>Phone: ${data.phone}</li>
		</ul>
		<h3>Message</h3>
		<p>${data.message}</p>`

		return {
			from: emailFrom,
			to: emailTo,
			subject: 'Student CVs',
			text: 'example',
			html: output
		}
	}
}
