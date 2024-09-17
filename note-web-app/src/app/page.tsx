import { Button } from "@/components/ui/button";
import { getSession } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  return (
    <>
      <h1>Home</h1>
      <Link href="/api/auth/signup">
        <Button variant="default">Signup</Button>
      </Link>
      <Link href="/api/auth/login">
        <Button variant="default">Login</Button>
      </Link>
    </>
  );
}
