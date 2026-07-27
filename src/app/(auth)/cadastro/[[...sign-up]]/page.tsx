import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
      path="/cadastro"
      routing="path"
      signInUrl="/entrar"
      fallbackRedirectUrl="/painel"
    />
  );
}
