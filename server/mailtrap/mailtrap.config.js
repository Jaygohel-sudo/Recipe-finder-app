// utils/sendEmail.js
import Brevo from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async (to, subject, content) => {
  try {
    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const sendSmtpEmail = {
      sender: {
        email: process.env.FROM_EMAIL || "no-reply@brevo.com",
        name: "Recipe Finder",
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: `<html><body>${content}</body></html>`,
    };

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email sent:", response.messageId);
  } catch (error) {
    console.error("❌ Email failed:", error.message || error);
  }
};
