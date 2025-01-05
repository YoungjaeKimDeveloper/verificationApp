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
    console.log(resetURL);
  } catch (error) {
    console.error("FAILED TO SEND resetPasswordEmail ", error.message);
  }
};
