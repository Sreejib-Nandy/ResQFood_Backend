import Twilio from "twilio";

const client = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const normalizePhone = (phone) => {
  return phone.startsWith("+") ? phone : `+91${phone}`;
}

export const sendSMS = async (to, body) => {
  try {
    await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: normalizePhone(to)
    });
  } catch (error) {
    console.error("Twilio SMS error:", error);
  }
};
