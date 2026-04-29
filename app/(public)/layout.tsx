import Navbar from '@/components/layout/navigation/Navbar';
import Footer from '@/components/layout/footer/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className='flex-1'>{children}</main>
      <Footer />
    </>
  );
}
