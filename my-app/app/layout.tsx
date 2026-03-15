import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/ui/Navbar';

export const metadata: Metadata = {
  title: 'SilverTech — Digital Literacy for Seniors',
  description:
    'A friendly, accessible digital literacy platform helping seniors navigate the modern internet safely and confidently.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <AuthProvider>
          <Navbar />
          <main id="main-content">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
