import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}
    >
      <SignIn path="/sign-in" />
    </div>
  );
}
