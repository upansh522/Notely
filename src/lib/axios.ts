import axios from "axios";

const base_url = "https://api.lemonsqueezy.com";
const apiKey = process.env.PAYMENT_API_KEY;

if (!apiKey) {
  throw new Error("PAYMENT_API_KEY is not defined in environment variables");
}

export const lemonsqueezyPayInstance = axios.create({
  baseURL: base_url,
  headers: {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    Authorization: `Bearer ${apiKey}`,
  },
});
