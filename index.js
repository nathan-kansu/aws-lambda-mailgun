const mailgun = require("mailgun-js");
const apiKey = process.env.MAILGUN_API_KEY;
const domain = `mail.${process.env.DOMAIN}`;
const mg = mailgun({ apiKey, domain });

const generateResponse = (body, statusCode) => {
    return {
        headers: {
            "access-control-allow-methods": "POST",
            "access-control-allow-origin": "*",
            "content-type": "application/json"
        },
        statusCode: statusCode,
        body: `{\"result\": ${body.message}}`
    };
};

const sendEmail = data => {
    const { from, to, subject, text } = data;
    const email = { from, to, subject, text };

    return mg.messages().send(email);
};

exports.handler = async (event, context, callback) => {
    const { body } = event;
    const data = JSON.parse(body);

    const result = await sendEmail(data);
    const response = generateResponse(result, 200);

    callback(null, response);
};
