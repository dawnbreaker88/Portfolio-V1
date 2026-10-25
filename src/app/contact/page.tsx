import type { Metadata } from "next";
import { ContactView } from "@/views/contact-view";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} for engineering opportunities, collaborations, and discussions.`,
};

export default function ContactPage() {
  return <ContactView />;
}
