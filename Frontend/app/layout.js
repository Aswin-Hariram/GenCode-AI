import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata = {
  title: "Gen Code",
  description: "Learn Data Structures and Algorithms interactively",
};

export default function RootLayout({ children }) {
  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  );
}
