import type { Metadata } from "next";
import Contact from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Febin C S: email and LinkedIn, where he is based and what he is doing now.",
};

export default function ContactPage() {
  return (
    <>
      <Contact />
    </>
  );
}
