export default function AuthContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='bg-primary h-screen flex items-center justify-center'>
      {children}
    </div>
  );
}
