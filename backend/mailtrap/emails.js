import { mailtrapClient, sender } from "./mailtrap.config.js";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
} from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recepient = [{ email: email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recepient,
      subject: "Verification",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });
    console.info("Email send successfully", response);
  } catch (error) {
    console.error(`FAILED TO SEND VERIFICATION EMAIL, ${verificationToken}`);
    throw new Error(`Error sending Verificaion email ${error.message}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const recepient = [{ email: email }];
    const response = await mailtrapClient.send({
      from: sender,
      to: recepient,
      template_uuid: "1a7ade27-ed24-43a4-888a-206d6506f31a",
      template_variables: {
        name: name,
      },
    });
    console.info("Welcome email sent successfully", response);
  } catch (error) {
    console.error("FAILED TO SEND WELCOME EMAIL", error.message);
    throw new Error("FAILED TO SEND WELCOME EMAIL", error.message);
  }
};

export const sendResetPasswordCode = async (email, resetURL) => {
  try {
    const recipients = [{ email: email }];
    mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Reset Code!",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Verification",
    });
  } catch (error) {
    console.error("FAILED TO SEND resetPasswordEmail ", error.message);
  }
};
