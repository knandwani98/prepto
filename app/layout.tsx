import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/components/Header";
import { SidebarProvider } from "@/components/AppSidebar";
import { UnsavedChangesProvider } from "@/components/UnsavedChanges";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteTitle = "Prepto — Interview prep kits";
const siteDescription =
  "Turn a job description into a personalised interview preparation kit.";

export const metadata: Metadata = {
  metadataBase: new URL("https://prepto.vercel.app"),
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    url: "/",
    siteName: "Prepto",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

const clerkLocalization = {
  socialButtonsBlockButton: "{{provider|titleize}}",
  socialButtonsBlockButtonManyInView: "{{provider|titleize}}",
  lastAuthenticationStrategy: "Last",
  signIn: {
    start: {
      title: "Sign in to Prepto",
      titleCombined: "Sign in to Prepto",
      subtitle: "Connect to Prepto with:",
      subtitleCombined: "Connect to Prepto with:",
    },
  },
  signUp: {
    start: {
      title: "Create your free account",
      titleCombined: "Create your free account",
      subtitle: "Connect to Prepto with:",
      subtitleCombined: "Connect to Prepto with:",
    },
  },
};

const clerkAppearance = {
  variables: {
    colorPrimary: "#63E6BE",
    colorPrimaryForeground: "#07111F",
    colorBackground: "#0D1B2D",
    colorForeground: "#EAF2FF",
    colorMutedForeground: "#9FB0C6",
    colorMuted: "#10233A",
    colorInput: "#0A1828",
    colorInputForeground: "#EAF2FF",
    colorDanger: "#FF7B8A",
    colorBorder: "#213650",
    colorNeutral: "#9FB0C6",
    colorRing: "#63E6BE",
    borderRadius: "10px",
  },
  elements: {
    card: "bg-surface border border-border shadow-none",
    headerTitle: "text-foreground",
    headerSubtitle: "text-muted",
    socialButtonsBlockButton:
      "bg-elevated border border-border-subtle text-foreground",
    socialButtonsBlockButtonText: "text-foreground",
    formFieldLabel: "text-muted",
    formFieldInput: "bg-input text-foreground",
    formButtonPrimary: "bg-primary text-background hover:opacity-90",
    footerActionText: "text-muted",
    footerActionLink: "text-secondary",
    dividerText: "text-muted",
    identityPreviewText: "text-foreground",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider appearance={clerkAppearance} localization={clerkLocalization}>
      <html lang="en" className={`${inter.variable} h-full scroll-smooth antialiased`}>
        <body className="relative flex h-full flex-col overflow-hidden font-sans">
          <ToastProvider>
            <UnsavedChangesProvider>
              <SidebarProvider>
                <Header />
                <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                  {children}
                </main>
              </SidebarProvider>
            </UnsavedChangesProvider>
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
