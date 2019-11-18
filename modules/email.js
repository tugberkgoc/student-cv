const nodemailer = require("nodemailer");
require('dotenv').config();


const transporter =nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "coventry4c@gmail.com",
        pass: "groupCV4"
    }
});

/*const takeParameters = (from,to,output) =>{
       return  mailOption =  {
        from: from,	
        to: to,
        subject: 'Student CVs',
        text: 'example',
        html: output 	 
      };
}*/



module.exports =  {
        transporter
        //takeParameters,
        //mailOption
        
}
