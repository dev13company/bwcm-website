"use server";

import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("❌ Missing RESEND_API_KEY in .env.local");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  await resend.emails.send({
    from: "Berachah Worship Center <onboarding@resend.dev>",
    to: "calebberachah123@gmail.com",
    subject: "Acknowledged Your Request",
    text: `
Name: ${name}
Email: ${email}
Message:
${message}
    `,
  });

  return { success: true };
}