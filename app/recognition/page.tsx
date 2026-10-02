import type { Metadata } from "next";
import Recognition from "@/components/sections/Recognition";

export const metadata: Metadata = {
  title: "Recognition",
  description: "Awards, leadership roles and certificates earned by Febin C S.",
};

export default function RecognitionPage() {
  return (
    <>
      <Recognition />
    </>
  );
}
