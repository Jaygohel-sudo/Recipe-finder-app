import { brevo } from "./brevo.config.js";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!to) {
      throw new Error("Recipient email is missing");
    }
    const response = await brevo.sendTransacEmail({
      sender: { email: "noreply@mealmagic.info", name: "MealMagic" }, // Must be a verified sender in Brevo
      to: [{ email: to }],
      subject,
      htmlContent: html || "<p>No HTML content provided.</p>",
    });

    console.log("✅ Email sent successfully:", response);
  } catch (error) {
    console.error("❌ Error sending email:", error.response?.body || error);
  }
};
