import './serverLocalStorageShim';
import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata = {
  title: "Gen Code",
  description: "Learn Data Structures and Algorithms interactively",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ fontFamily: 'Lexend, Inter, system-ui, -apple-system, sans-serif' }}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
