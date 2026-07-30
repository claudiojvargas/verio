import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <SignIn
      path="/entrar"
      routing="path"
      signUpUrl="/cadastro"
      fallbackRedirectUrl="/painel"
    />
  );
}
