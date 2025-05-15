import type {Metadata} from 'next';
import { Inter as FontSans } from "next/font/google" // Using Inter as a common sans-serif example
import './globals.css';
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"; // Ensure Toaster is imported

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: 'TrackStar: Time Tracking Reimagined',
  description: 'Track your tasks efficiently with TrackStar and get smart suggestions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {children}
        {/* Toaster can also be placed here if preferred globally over page-specific placement */}
        {/* <Toaster /> */} 
      </body>
    </html>
  );
}
