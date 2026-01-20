// Frontend/src/components/layout/MainLayout.tsx
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CartFloating from '../cart/CartFloating';
import ChatWidget from '../chat/ChatWidget';
import ToastContainer from '../ui/ToastContainer';
import HolidayOverlay from './HolidayOverlay';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200 relative">
      <HolidayOverlay />
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-in relative z-10">
        {children}
      </main>
      <Footer />
      <CartFloating />
      <ChatWidget />
      <ToastContainer />
    </div>
  );
}
