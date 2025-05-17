import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Lato } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

// Updated to use next/font/google for Geist fonts
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'], // Common practice to specify subsets
  preload: true,
  display: 'swap',
});
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'], // Common practice to specify subsets
  preload: true,
  display: 'swap',
});

const lato = Lato({
  weight: ['400', '700'],
  variable: '--font-lato',
  subsets: ['latin'],
  preload: true,
  display: 'swap',
});

// Move viewport to a separate export
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Airodental | AI-Powered Dental Practice Management",
  description: "Revolutionize your dental practice with Airodental's AI solutions. Streamline patient communication, enhance staff training, and improve practice efficiency with our comprehensive AI ecosystem.",
  keywords: "dental AI, dental practice management, AI dental assistant, dental automation, dental staff training, patient communication, dental technology, Airodental, dental practice software",
  authors: [{ name: "Airodental Team" }],
  creator: "Airodental",
  publisher: "Airodental",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://airodental.com'),
  openGraph: {
    title: "Airodental | AI-Powered Dental Practice Management",
    description: "Revolutionize your dental practice with Airodental's AI solutions. Streamline patient communication, enhance staff training, and improve practice efficiency.",
    url: "https://airodental.com", // Replace with your actual domain
    siteName: "Airodental",
    images: [
      {
        url: "/og-image.png", // Ensure this image is in apps/web/public
        width: 1200,
        height: 630,
        alt: "Airodental - AI for Dental Practices"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Airodental | AI-Powered Dental Practice Management",
    description: "Revolutionize your dental practice with AI solutions for patient communication, staff training, and practice efficiency.",
    images: ["/twitter-image.png"], // Ensure this image is in apps/web/public
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: "Technology",
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_TOKEN",
  },
};

// Create a client component for the layout content
function RootLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body className={`${geistSans.variable} ${geistMono.variable} ${lato.variable} antialiased`}>
      {children}
    </body>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#0f172a', // Match with your primary color
        }
      }}
      allowedRedirectOrigins={[
        'https://admin.prereq.xyz',
        'https://laine.prereq.xyz', 
        'https://docs.prereq.xyz',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003'
      ]}
    >
      <html lang="en" suppressHydrationWarning>
        <RootLayoutContent>
          {children}
        </RootLayoutContent>
      </html>
    </ClerkProvider>
  );
}
