import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>Home</h1>
      <Link href="/dashboard">
        <Button variant="default">Go to Dashboard</Button>
      </Link>
    </>
  );
}
