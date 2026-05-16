import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="app-shell flex min-h-screen flex-col">
      <div className="orb -left-32 top-20 h-72 w-72 bg-brand-400" aria-hidden />
      <div className="orb right-0 top-1/3 h-96 w-96 bg-indigo-400" aria-hidden />
      <div className="orb bottom-0 left-1/2 h-80 w-80 bg-cyan-300" aria-hidden />

      <Header />
      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
