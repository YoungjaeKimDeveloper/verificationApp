import { mailtrapClient, sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";

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
