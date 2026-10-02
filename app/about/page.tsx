import type { Metadata } from "next";
import About from "@/components/sections/About";
import Capabilities from "@/components/sections/Capabilities";
import Process from "@/components/sections/Process";

export const metadata: Metadata = {
  title: "About",
  description: "Who Febin C S is, what he works with and how he takes a board from schematic to working firmware.",
};

export default function AboutPage() {
  return (
    <>
      <About />
      <Capabilities />
      <Process />
    </>
  );
}
