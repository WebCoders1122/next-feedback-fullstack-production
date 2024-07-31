//signin nextjs page with username validation via zod and next auth
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
//shadcn imports
import H2 from "@/components/ui/H2";
import P from "@/components/ui/P";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useToast } from "@/components/ui/use-toast";
import { loginSchema } from "@/schemas/loginSchema";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  // for button disaling and animation
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // to add toast messages
  const { toast } = useToast();

  //router
  const router = useRouter();

  // 1. Define your form.
  const login = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoggingIn(true);
    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });
      console.log(response);

      // TODO: page getting refreshed, so thist part or try and catch is pending
      setTimeout(() => {
        // router.push(`/verify/${username}`);
      }, 500);
      //TODO: remove this timout and push ==> replace
    } catch (error) {
      // const axiosError = error as AxiosError<ApiResponseInterface>;
      console.log(error);
      // const errorMessage =
      //   axiosError.response?.data.message ?? "Registeration Failed";
      // toast({
      //   title: errorMessage,
      // });
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <div className='bg-secondary sm:min-h-screen flex justify-center items-center'>
      <div className='w-full max-w-screen sm:max-w-md'>
        {/* heading div started */}
        <Card>
          <CardHeader>
            <H2>Login to Feedback App</H2>
            <P className='text-center'>Pleae Login to continue</P>
          </CardHeader>
          <CardContent>
            {/* form started */}
            <Form {...login}>
              <form
                onSubmit={login.handleSubmit(onSubmit)}
                className='space-y-6 '>
                <FormField
                  name='email'
                  control={login.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder='Your email Here'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name='password'
                  control={login.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='Your password Here'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* TODO: Add retype password */}

                <Button
                  className='w-full space-y-6 font-medium text-sm'
                  type='submit'
                  disabled={isLoggingIn}>
                  {isLoggingIn ? (
                    <>
                      <Loader2 className='animate-spin mr-3' /> Logging In!
                      Please Wait
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </Form>
            {/* form end */}
          </CardContent>
          <CardFooter>
            <div className='text-center text-sm w-full'>
              Not Registered!
              <Link
                className='text-primary underline font-medium'
                href={"/signup"}>
                {" "}
                Signup Here
              </Link>
            </div>
          </CardFooter>
        </Card>
        {/* heading div end */}
      </div>
    </div>
  );
};
export default LoginPage;

//TODO: try to add login with both => username and password
