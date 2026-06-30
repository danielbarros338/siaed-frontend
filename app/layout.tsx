import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/providers/auth-provider";
import { MockProvider } from "@/lib/providers/mock-provider";
import { QueryProvider } from "@/lib/providers/query-provider";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SIAED",
  description: "Sistema Integrado de Apoio Educacional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">
        <MockProvider>
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
            <Toaster />
          </QueryProvider>
        </MockProvider>
      </body>
    </html>
  );
}
