import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import CheckoutPage from './pages/CheckoutPage';
import DashboardPage from './pages/DashboardPage';
import PaymentCallbackPage from './pages/PaymentCallbackPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<CheckoutPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="payment/callback" element={<PaymentCallbackPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        <Toaster
          position="top-right"
          gutter={12}
          toastOptions={{
            duration: 4000,
            className:
              '!rounded-xl !border !border-slate-200/80 !bg-white/95 !px-4 !py-3 !text-sm !font-medium !text-slate-800 !shadow-card backdrop-blur-xl dark:!border-slate-700 dark:!bg-slate-900/95 dark:!text-slate-100',
            success: {
              iconTheme: { primary: '#0891b2', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </BrowserRouter>
    </ThemeProvider>
  );
}
