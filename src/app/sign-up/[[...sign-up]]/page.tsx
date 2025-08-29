import AuthContainer from '@/components/auth-container';
import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <AuthContainer>
      <SignUp />
    </AuthContainer>
  );
}
