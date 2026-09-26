import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type BookingDetails = {
  serviceName: string;
  vehicleLabel: string;
  preferredDate: string;
  location: string;
};

export async function notifyAdminsOfBooking(details: BookingDetails) {
  await resend.emails.send({
    from: "AfroChip <noreply@mail.tamroexpress.co.zw>",
    to: process.env.ADMIN_NOTIFICATION_EMAIL!,
    subject: `New booking: ${details.serviceName}`,
    text: `New service request.\n\nService: ${details.serviceName}\nVehicle: ${details.vehicleLabel}\nPreferred date: ${details.preferredDate}\nLocation: ${details.location}\n\nView it in the admin dashboard.`,
  });
}

export async function notifyAdminsOfBookingWhatsApp(details: BookingDetails) {
  const message = `New booking: ${details.serviceName}\nVehicle: ${details.vehicleLabel}\nDate: ${details.preferredDate}\nLocation: ${details.location}`;

  const url = `https://api.callmebot.com/whatsapp.php?phone=${process.env.CALLMEBOT_PHONE}&text=${encodeURIComponent(message)}&apikey=${process.env.CALLMEBOT_API_KEY}`;

  try {
    await fetch(url);
  } catch (err) {
    console.error("WhatsApp notification failed:", err);
  }
}