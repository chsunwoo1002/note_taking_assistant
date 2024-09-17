import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { env } from "@/lib/env.config";

const Login: React.FC = () => {
  return (
    <div>
      <h1>Login</h1>
      {env.AUTH_SECRET}
      <Link href="/signup">
        <Button variant="ghost">Already have an account? Sign in</Button>
      </Link>
      <Link href="/api/auth/login">Login</Link>
    </div>
  );
};

export default Login;
