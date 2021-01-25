const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const APP_NAME = "Restoplus Counter";

exports.sendEmail = functions.firestore
  .document("countCollection/count")
  .onUpdate((change, context) => {
    const newCount = change.after.data().count;

    const email = gmailEmail;

    if (newCount % 10 === 0 && newCount > 0) {
      return sendEmail(email, newCount);
    } else {
      return null;
    }
  });

async function sendEmail(email, count) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email,
  };

  mailOptions.subject = `Restoplus Counter Update!`;
  mailOptions.text = `Hey! Your counter has reached ${count || ""}!`;
  await mailTransport.sendMail(mailOptions);
  console.log("Update email sent to:", email);
  return null;
}
