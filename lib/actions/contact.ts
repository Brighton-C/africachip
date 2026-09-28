"use server";

import { Resend } from "resend";
import { redirect } from "next/navigation";
import { getAdminEmails } from "@/lib/adminEmails";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const contact = formData.get("contact") as string;
  const message = formData.get("message") as string;

  if (!name || !contact || !message) {
    throw new Error("Please fill in all fields.");
  }

  await resend.emails.send({
    from: "AfricaChip <noreply@mail.tamroexpress.co.zw>",
        to: getAdminEmails(),
    subject: `New website enquiry from ${name}`,
    text: `Name: ${name}\nContact: ${contact}\n\nMessage:\n${message}`,
  });

  redirect("/contact?sent=true");
}