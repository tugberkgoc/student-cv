const nodemailer = require("nodemailer");
require('dotenv').config();


const transporter =nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

/*const takeParameters = (arguments) =>{
       return  mailOption =  {
        from: arguments[0],	
        to: arguments[1],
        subject: 'Student CVs',
        text: 'example',
        html: arguments[2] 	 
      };
}*/



module.exports =  {
        transporter,
        //takeParameters
        //mailOption
        
}
