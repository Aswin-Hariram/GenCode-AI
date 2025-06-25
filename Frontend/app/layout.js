import './globals.css';
import ClientLayout from './ClientLayout';
import { Lexend } from 'next/font/google';

const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' });

export const metadata = {
  title: "Gen Code",
  description: "Learn Data Structures and Algorithms interactively",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={lexend.variable}>
      <body className="antialiased" style={{ fontFamily: 'var(--font-lexend), sans-serif' }}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
