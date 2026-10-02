import type { Metadata } from "next";
import Experience from "@/components/sections/Experience";

export const metadata: Metadata = {
  title: "Experience",
  description: "Where Febin C S has worked and taught, and his education.",
};

export default function ExperiencePage() {
  return (
    <>
      <Experience />
    </>
  );
}
