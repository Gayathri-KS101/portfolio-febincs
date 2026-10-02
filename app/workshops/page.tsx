import type { Metadata } from "next";
import Workshops from "@/components/sections/Workshops";

export const metadata: Metadata = {
  title: "Workshops",
  description: "Workshops and classes run by Febin C S, from IEDC Summit 2026 to STM32 sessions with Tecknow Club.",
};

export default function WorkshopsPage() {
  return (
    <>
      <Workshops />
    </>
  );
}
