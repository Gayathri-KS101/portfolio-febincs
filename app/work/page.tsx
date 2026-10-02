import type { Metadata } from "next";
import Projects from "@/components/sections/Projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Embedded projects by Febin C S: a laser communication link, an IoT hydroponics controller, a device-to-device communication kit and more.",
};

export default function WorkPage() {
  return (
    <>
      <Projects />
    </>
  );
}
