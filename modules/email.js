'use strict'

const nodemailer = require('nodemailer')
const sqlite = require('sqlite-async')
require('dotenv').config()

const dbName = 'website.db'



module.exports = class Email{

async transporter(){
	return nodemailer.createTransport({
		service: 'gmail',
		auth:{
				user: process.env.EMAIL,
				pass: process.env.PASSWORD
			}
	})
}

// eslint-disable-next-line max-lines-per-function
async emailSetup(emailFrom, emailTo, data)  {
		
	 

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



async getDataForSender(id){
	const db = await sqlite.open(dbName)
	const sql = `SELECT email FROM users WHERE id=${id};`
	const fromData = await db.get(sql)
	await db.close()
	return fromData
}

async getDataForReciever(toId){
	const db = await sqlite.open(dbName)
	const sql = `SELECT email FROM users WHERE id=${toId};`
	const toData = await db.get(sql)
	await db.close()
	return toData
	}

}

