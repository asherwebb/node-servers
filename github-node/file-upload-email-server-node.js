var nodemailer = require('nodemailer');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var fs = require('fs');
var inlineBase64 = require('nodemailer-plugin-inline-base64');
var app = express();
app.use(bodyParser({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(cors());
var imageDataURI = '';
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: /* your biz email */,
    pass: /* passwd to that email */
  }
});
//endpoint to e-mail file
app.post('/upload', function(req, res) {
  //console.log(req.body.data);
  var imageDataURI = req.body.data;
  var emailRecipient = req.body.recipient;
  var emailSubject = req.body.subject;
  sendEmailWithImageAttachment(imageDataURI);

  function sendEmailWithImageAttachment(imageDataURI) {
    var imageAttachment = imageDataURI.split("base64,")[1];
    var imageAttachmentFile = '<img src="data:image/jpeg;base64,' + imageAttachment + '" />';
    var imageAttachmentTest = 'data:image/jpeg;base64,' + imageAttachment;

    var mailOptions = {
      from: '', // sender address 'Sender name as displayed <senderemail@app.com>'
      to: emailRecipient, // list of receivers 
      subject: emailSubject, // Subject line
      // html: '<img src="data:image/gif;base64,' + imageAttachment+ '" />'
      //text: 'Hello world ✔', // plaintext body
      attachments: [{
        path: imageAttachmentTest
      }]
    };

    transporter.use('compile', inlineBase64);
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Message sent');
      }
    });
    res.send('great');

  }
});

//endpoint to e-mail passwd
app.post('/passcode', function( req, res ){
  var passcodeData = req.body;
      console.log(passcodeData);
      var email = passcodeData.email;
      var passcode = passcodeData.passcode;
      console.log('email: ' + email +'. Pass: '+passcode);

      var mailOptions = {
      from: '', // sender address - see above
      to: email, // list of receivers 
      subject: 'subject', // Subject line
      // html: '<img src="data:image/gif;base64,' + imageAttachment+ '" />'
      text: 'Hello. You have successfully setup your  App account. Here is the information requested: '+ passcode +'. Please keep this information safe as you may be locked out of your files if you do not. ' // plaintext body
    };

    
        transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Message sent');
      }
    });

      res.send('great');  

});

app.use(express.static(__dirname));
app.listen(process.env.PORT || 3456);