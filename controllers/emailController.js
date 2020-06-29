const Response = require('../util/response_manager'),
    HttpStatus = require('../util/http_status'),
    express = require('express'),
    nodemailer = require('nodemailer'),
    Customer = require("../models/customer");


const router = express.Router();

router.use(require("body-parser").urlencoded({ extended: true }));

exports.sendMail = (req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'melijah200@gmail.com',
            pass: 'emailpasswordgoeshere'
        }
    });

    //Find a customer and get the email
    const id = req.params.customer_id;
    Customer.findById(id, (err, foundCustomer) => {
        if (err) {
            res.status(500).json({
                status: "fail",
                message: "Error occured while finding customer"
            });
        } else {
            if (foundCustomer.email != "" || foundCustomer.email != undefined) {
                const recipient = foundCustomer.email,
                    subject = req.body.subject,
                    text = req.body.text;

                const params = {
                    from: 'melijah200@gmail.com',
                    to: recipient,
                    subject: subject,
                    text: text
                };

                transporter.sendMail(params, function (error, info) {
                    if (error) {
                        console.log(error);
                        res.status(401).json({
                            status: "Bad request",
                            message: error
                        })
                    } else {
                        console.log('Email sent: ' + info.response);
                        res.status(200).json({
                            status: "success",
                            message: info
                        })
                    }
                });
            } else {
                res.status(404).json({
                    status: "fail",
                    message: "Customer not found"
                });
            }
        }
    })
}

exports.sendSMS = async (req, res) => {
    let customer

    try {
        customer = await Customer.findById(req.params.customer_id)
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Error occured while finding customer"
        });
    }

    if (!customer) {
        res.status(404).json({
            status: "fail",
            message: "Customer not found"
        });
    }

    const accountSid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_AUTH;
    const client = require('twilio')(accountSid, authToken);

    client.messages
        .create({
            body: req.body.text,
            from: TWILIO_NUMBER,
            to: customer.phone_number
        })
        .then(message => {
            res.status(200).json({
                status: "success",
                message: message
            })
        })
        .catch(error => {
            res.status(500).json({
                status: "fail",
                message: "couldn't send SMS to customer customer",
                Error: error
            });
        })

}
