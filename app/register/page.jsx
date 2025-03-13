import 'server-only';

import { auth } from "@/auth"
import { redirect } from "next/navigation";
import RegisterForm from '@/components/register-form';


export default async function RegisterPage() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect("/api/auth/signin");
    return null; 
  }
  
  return (
    <main>
      <RegisterForm />
    </main>
  )
};