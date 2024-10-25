import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/toaster";
import PageLoader from "@/components/shared/page-loading-indicator";
import "@/styles/globals.css";
import {
  ClerkLoaded,
  ClerkLoading,
  ClerkProvider,
  SignedIn,
} from "@clerk/nextjs";
import { ThemeProvider } from "@/components/shared/theme/provider";
import { QueryProvider } from "@/components/shared/query-provider";
import HeaderButtons from "@/components/shared/header/buttons";

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
  title: "Still Human",
  description: "Generate notes off your Claude chatlogs!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ClerkLoading>
              <PageLoader />
            </ClerkLoading>
            <ClerkLoaded>
              <div className={`flex flex-col w-full p-8`}>
                <SignedIn>
                  <HeaderButtons />
                </SignedIn>
              </div>
              <QueryProvider>
                {children}
                <Toaster />
              </QueryProvider>
            </ClerkLoaded>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
