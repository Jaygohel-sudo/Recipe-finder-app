import { sendEmail } from "./sendEmail.js";

await sendEmail({
  to: "jrgohel14@gmail.com", // make sure this is defined
  subject: "Welcome to MealMagic!",
  html: "<h1>Welcome!</h1><p>Thanks for signing up.</p>",
});
