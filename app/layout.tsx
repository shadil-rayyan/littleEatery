import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Poppins, Inter, David_Libre } from 'next/font/google';


const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // Specify the weights you need
  variable: '--font-poppins', // Optional: Define a CSS variable
});

const davidLibre = David_Libre({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // Specify available weights
  variable: '--font-david-libre',
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "The Little Eatery",
  description: "Your resturant for the best food in town",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
