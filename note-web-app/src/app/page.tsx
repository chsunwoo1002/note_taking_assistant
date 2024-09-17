import { Button } from "@/components/ui/button";
import { getSession } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <>
      <h1>Home</h1>
      <Link href="/dashboard">
        <Button variant="default">Dashboard</Button>
      </Link>
      <Link href="/signup">
        <Button variant="default">Signup</Button>
      </Link>
      <Link href="/login">
        <Button variant="default">Login</Button>
      </Link>
    </>
  );
}
