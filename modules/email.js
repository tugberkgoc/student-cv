'use strict'

const nodemailer = require("nodemailer");
require('dotenv').config();


const transporter =nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: "coventry4c@gmail.com",
		pass: "groupCV4"
	}
});

function emailSetup(emailFrom, emailTo,data) {
	const output = `<p>You have a new contact request.</p>
	<h3>Contact Details</h3>
	<ul><li>Name: ${data.name}</li>  
		<li>Company: ${data.company}</li>
		<li>Email: ${data.email}</li>
		<li>Phone: ${data.phone}</li>
	</ul>
	<h3>Message</h3>
	<p>${data.message}</p>`
	
	const mailOption =  {
		from: emailFrom,	
		to: emailTo,
		subject: 'Student CVs',
		text: 'example',
		html: output
	}
	return mailOption
}


module.exports =  {
	transporter,
	emailSetup
	//takeParameters,
	//mailOption
        
}
