import { supabase } from "@/core/supabase"
import { useUser } from "@/hooks/useUser"
import type { Provider } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import "@/style.css"

import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "./components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "./components/ui/form"
import { Input } from "./components/ui/input"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

function IndexOptions() {
  const { user, setUser } = useUser()
  const [action, setAction] = useState<"LOGIN" | "SIGNUP">("LOGIN")
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  useEffect(() => {
    async function init() {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error(error)
        return
      }
      if (!!data.session) {
        setUser(data.session.user)
        sendToBackground({
          name: "init-session",
          body: {
            refresh_token: data.session.refresh_token,
            access_token: data.session.access_token
          }
        })
      }
    }

    init()
  }, [])

  const handleEmailLogin = async (
    type: "LOGIN" | "SIGNUP",
    username: string,
    password: string
  ) => {
    try {
      const {
        error,
        data: { user }
      } =
        type === "LOGIN"
          ? await supabase.auth.signInWithPassword({
              email: username,
              password
            })
          : await supabase.auth.signUp({ email: username, password })

      if (error) {
        alert("Error with auth: " + error.message)
      } else if (!user) {
        alert("Signup successful, confirmation mail should be sent soon!")
      } else {
        setUser(user)
      }
    } catch (error) {
      console.log("error", error)
      alert(error.error_description || error)
    }
  }

  const handleOAuthLogin = async (provider: Provider, scopes = "email") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        scopes,
        redirectTo: location.href
      }
    })
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data)
  }

  return (
    <main className="flex flex-col bg-primary text-primary-foreground w-screen h-screen justify-center items-center">
      {user && (
        <>
          <Button
            variant="secondary"
            onClick={() => {
              supabase.auth.signOut()
              setUser(null)
            }}>
            Logout
          </Button>
        </>
      )}
      {!user && (
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-medium text-center">
            {action === "LOGIN" ? "Sign in" : "Sign up"}
          </h1>
          {action === "LOGIN" ? (
            <div className="flex flex-row gap-2 items-center">
              <p className="text-sm ">Don't have an account? </p>
              <Button
                className="font-medium underline"
                onClick={() => setAction("SIGNUP")}>
                Sign up
              </Button>
            </div>
          ) : (
            <div className="flex flex-row gap-2 items-center">
              <p className="text-sm">Already have an account? </p>
              <Button
                className="font-medium underline"
                onClick={() => setAction("LOGIN")}>
                Sign in
              </Button>
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-2 justify-between mb-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-primary"
                          placeholder="Your Email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-primary"
                          placeholder="Your password"
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-4">
                <Button
                  className="flex flex-row gap-2 w-full"
                  variant="secondary"
                  type="submit">
                  {action === "LOGIN" ? "Sign in" : "Sign up"}
                </Button>
              </div>
            </form>
          </Form>
          <Separator className="my-4" />
          <Button
            variant="secondary"
            onClick={(e) => {
              handleOAuthLogin("google")
            }}>
            {action === "LOGIN" ? "Sign in with Google" : "Sign up with Google"}
          </Button>
        </div>
      )}
    </main>
  )
}

export default IndexOptions
