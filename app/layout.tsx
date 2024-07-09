import { ReactNode } from "react";
import Navigation from "./_components/Navigation";
import { Metadata } from "next";
import Logo from "./_components/Logo";
import "@/app/_styles/globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | The Wild Oasis",
    default: "Welcome | The Wild Oasis",
  },
  description: "The Wild Oasis is a place to relax and enjoy nature.",
  
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-primary-950 text-primary-100 min-h-screen">
        <header>
          <Logo />
          <Navigation />
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
