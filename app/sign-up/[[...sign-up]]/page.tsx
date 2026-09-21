import { SignUp } from "@clerk/nextjs";
import { AuthSplitLayout, authClerkAppearance } from "@/components/AuthSplitLayout";

export default function SignUpPage() {
  return (
    <AuthSplitLayout>
      <SignUp
        forceRedirectUrl="/new"
        signInForceRedirectUrl="/new"
        signInUrl="/sign-in"
        appearance={authClerkAppearance}
      />
    </AuthSplitLayout>
  );
}
