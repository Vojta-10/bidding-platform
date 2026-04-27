import Navbar from '@/components/layout/navigation/Navbar';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar></Navbar>
      {children}
    </>
  );
}
