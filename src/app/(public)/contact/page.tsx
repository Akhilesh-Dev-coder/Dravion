import React from "react";
import ContactClient from "./ContactClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Dravion | Request Quote & Free Consultation",
  description: "Get in touch with Dravion technology studio. Request a custom web development or mobile app quote, find affordable website costs, or enquire about digital visiting cards.",
  keywords: [
    "dravion",
    "website costs",
    "affordable websites",
    "visiting card for free",
    "digital visiting card",
    "webapps",
    "mobile apps",
    "hire web developers",
    "contact dravion"
  ]
};

export default function ContactPage() {
  return <ContactClient />;
}
