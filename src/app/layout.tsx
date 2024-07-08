import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import { ThemeProvider } from "@/components/ui/providers/ThemeProviders";
import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from 'nextjs-toploader'
import DesignerContextProvider from "@/components/context/DesignerContext";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FormBuilder",
  description: "Generated Alvieri",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>

      <html lang="en">
      <body className={inter.className}>
        <NextTopLoader />
          <DesignerContextProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
            {children}
            <Toaster />
            </ThemeProvider>
          </DesignerContextProvider>
        </body>
      </html>

    </ClerkProvider>
  );
}
