'use strict'


const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL,
		pass: process.env.PASSWORD
	}
})

// eslint-disable-next-line max-lines-per-function
const emailSetup = (emailFrom, emailTo, data) => {
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
	<p>${data.message}</p>
`
	return {
		from: emailFrom,
		to: emailTo,
		subject: 'Student CVs',
		text: 'example',
		html: output
	}
}


module.exports = {
	transporter,
	emailSetup
}
