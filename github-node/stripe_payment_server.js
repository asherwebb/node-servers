
var nodemailer = require('nodemailer');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var stripe = require('stripe')( /* s t r i p e  k e y  h e r e */);

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: /* you@yourbizgmailacct.bizname */,
        pass: /* yourpass*/
    }
    });

var app = express();
app.use(bodyParser());
// app.use(cors());

app.post('/charge', function(req, res) {
    //  res.writeHead(200, {'Content-Type':'text/plain'});
    
    console.log('request is ' + req.body.token.id);
    var stripeToken = req.body.token.id;
    var stripeUserEmail = req.body.stripeRoomInfo.email;
    console.log('stripe user email is ' + stripeUserEmail);
	console.log('stripe token is ' + stripeToken);
     var amount = req.body.stripeRoomInfo.bookingAmount;
     var hotelEmail = req.body.stripeRoomInfo.email2;
     var hotelName = req.body.stripeRoomInfo.hotelName;
     var customerName = req.body.stripeRoomInfo.customerName;
     console.log('hotel name is ' + hotelName);
     var emailRecipients = hotelEmail + ', ' + stripeUserEmail + '',//enter recipients
     var bookingDescription = req.body.stripeRoomInfo.bookingDescription;
     console.log(req.body.stripeRoomInfo);
    
     stripe.charges.create({
         card: stripeToken,   
         currency: 'usd',
         amount: amount
    },
    function(err, success) {
        if (err) {
            console.log(err);
            res.send(
                        {   
                            type:"error",
                            message: "Your credit card was not successfully processed. Please make sure the card is valid and has a balance exceeding the charge and try again."
                        }
                    );
            
            
        } else {
            console.log(success);
            //get transaction id
            console.log('success id is ' + success.id);

            //send e-mail verification
                var mailOptions = {
                from: 'The cool service responding <coolservice@gmail.com>', // sender address will change to whoever@service.com
                to: emailRecipients, // list of receivers -- will also send on to the whoever@service.com
                subject: 'here is a random generated confirmation #' + success.id, // Subject line
                //text: 'Hello world ✔', // plaintext body
                html: '<h2>Greetings from biz!</h2>'
                        +'This e-mail is to confirm that '
                        +'<b>' + customerName + '</b> booked a room at ' + hotelName + ' for $' + amount + ' with the following details:<br />' 
                        + bookingDescription+ '✔' 
                        + '<br />' +
                        '<p>Confirmation # : ' + success.id + '</p>'
                        

                        // html body
                };

                var encodedResponseData = {
                    hotel: hotelName,
                    description: bookingDescription,
                    amount: amount

                }

                transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
            }else{
                console.log('Message sent: ' + info.response);



                }
            });

                       res.send(
            {

               type:"success", 
               id: success.id,
               message:"Your room has successfully been booked at " + hotelName + "! You should receive an email shortly with confirmation details. Your confirmation number is : " + success.id + ". Visit account settings from the app's home screen to view your recent bookings",
               parseBookingData: encodedResponseData
            }
                );
        }
    });
                   
});

app.use(express.static(__dirname));
app.listen(process.env.PORT || 3000);
