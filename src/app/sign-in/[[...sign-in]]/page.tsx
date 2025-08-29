import AuthContainer from '@/components/auth-container';
import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <AuthContainer>
      <SignIn />;
    </AuthContainer>
  );
}
