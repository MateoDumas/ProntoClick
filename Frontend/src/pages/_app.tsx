// Frontend/src/pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleMapsProvider } from '../contexts/GoogleMapsContext';
import { ThemeProvider } from '../contexts/ThemeContext';

import MainLayout from '../components/layout/MainLayout';

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <GoogleMapsProvider>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </GoogleMapsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
