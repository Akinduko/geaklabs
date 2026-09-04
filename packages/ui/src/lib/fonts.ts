import { Schibsted_Grotesk, Instrument_Serif } from "next/font/google";

/**
 * GEAK LABS type system.
 * - Schibsted Grotesk: everything that is read — body, interface, labels, headings below the hero.
 * - Instrument Serif: display only — the hero headline and page titles.
 * Poppins survives solely in the logo wordmark, where the brand guideline mandates it.
 */
export const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
  style: ["normal", "italic"],
  variable: "--font-schibsted",
  display: "swap",
});

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

/** Convenience: attach both font variables to <html>. */
export const fontVariables = `${schibsted.variable} ${instrumentSerif.variable}`;
