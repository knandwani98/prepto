import { SignIn } from "@clerk/nextjs";
import { AuthSplitLayout, authClerkAppearance } from "@/components/AuthSplitLayout";

export default function SignInPage() {
  return (
    <AuthSplitLayout>
      <SignIn
        forceRedirectUrl="/new"
        signUpForceRedirectUrl="/new"
        signUpUrl="/sign-up"
        appearance={authClerkAppearance}
      />
    </AuthSplitLayout>
  );
}
