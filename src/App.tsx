import { Header } from '@/components/layout/Header';
import { Home } from '@/pages/Home';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Home />
      <Toaster position="top-center" richColors />
    </div>
  );
}
