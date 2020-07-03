const nodeMailer = require("../config/nodemailer");

// This is the another way for exporting a method
exports.newComment = (comment) => {
  // to Send template in mail
  let htmlString = nodeMailer.renderTemplate(
    { comment: comment },
    "/comments/new_comment.ejs"
  );

  nodeMailer.transporter.sendMail(
    {
      from: "ayush21@gmail.com",
      to: comment.user.email,
      subject: "New comment published!",
      // html: '<h1>Yup, your comment is now published <h1>'
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("Error in sending mail", err);
        return;
      }
      console.log("Message send", info);
      return;
    }
  );
};
