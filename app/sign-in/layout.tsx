import FooterSlim from '@/components/layout/footer/FooterSlim';

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className='flex flex-1 items-center justify-center p-4'>
        {children}
      </main>
      <FooterSlim />
    </>
  );
}
