import dotenv from "dotenv";
import { MailtrapClient } from "mailtrap";
dotenv.config({ path: "/Users/youngjaekim/Desktop/verification_App/.env" });

export const mailtrapClient = new MailtrapClient({
  token: process.env.MailTrapToken,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Jeki",
};
// const recipients = [
//   {
//     email: "2015fromjeki@gmail.com",
//   },
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);
