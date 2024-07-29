//signup nextjs page with username validation via zod
"use client";

import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/schemas/signUpSchema";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
//shadcn imports
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import H2 from "@/components/ui/H2";
import P from "@/components/ui/P";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { set } from "mongoose";
import { APIPromise } from "openai/core.mjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const SignupPage = () => {
  //react states to manege username, isCheckingUsernameValidation, isLoadingValidationMessage, validationMessage, isvalidated, isRegistering
  const [username, setUsername] = useState("");
  const [isCheckingUsernameValidation, setIsCheckingUsernameValidation] =
    useState(false);
  const [isLoadingValidationMessage, setIsLoadingValidationMessage] =
    useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [isvalidated, setIsvalidated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // to add toast messages
  const { toast } = useToast();

  //router
  const router = useRouter();

  // 1. Define your form.
  const register = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setIsRegistering(true);
    try {
      const response = await axios.post("/api/signup", values);
      toast({
        title: response.data.message,
        variant: "success",
      });
      console.log(response);
      setTimeout(() => {
        router.push("/verify");
      }, 500);
      //TODO: remove this timout
    } catch (error: any) {
      console.log(error);
      toast({
        title: error.response.data.message,
      });
    } finally {
      setIsRegistering(false);
    }
  }

  // 3 . applying debouncing technique to avoid too many request to server
  const debounced = useDebounceCallback(setUsername, 400);

  //4. to check that username is unique or not
  useEffect(() => {
    const checkUsernameValidation = async () => {
      setIsvalidated(false);
      setValidationMessage("");
      if (!username) return;
      setIsCheckingUsernameValidation(true);
      try {
        const response = await axios.get(
          `/api/validate-username?username=${username}`
        );
        setIsvalidated(response.data.success);
        setValidationMessage(response.data.message);
      } catch (error: any) {
        setIsvalidated(error.response.data.success);
        setValidationMessage(error.response.data.message);
      } finally {
        setIsCheckingUsernameValidation(false);
      }
    };
    checkUsernameValidation();
  }, [username]);

  return (
    <div className='bg-secondary sm:min-h-screen flex justify-center items-center'>
      <div className='w-full max-w-screen sm:max-w-md'>
        {/* heading div started */}
        <Card>
          <CardHeader>
            <H2 className='text-4xl text-center font-bold'>
              Signup to Feedback App
            </H2>
            <P>Pleae signup to get started</P>
          </CardHeader>
          <CardContent>
            {/* form started */}
            <Form {...register}>
              <form
                onSubmit={register.handleSubmit(onSubmit)}
                className='space-y-6 '>
                <FormField
                  name='username'
                  control={register.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Your Username Here'
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debounced(e.target.value);
                          }}
                        />
                      </FormControl>
                      {isCheckingUsernameValidation ? (
                        <span className='text-sm text-gray-500'>
                          Checking username availability...
                        </span>
                      ) : (
                        <p
                          className={`text-sm inline ${
                            isvalidated ? "text-green-500" : "text-red-500"
                          }`}>
                          {validationMessage.split("-").map((message, i) => {
                            if (message.length < 3) return null;
                            return (
                              <span
                                className='block'
                                key={i}>{`-${message}`}</span>
                            );
                          })}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name='email'
                  control={register.control}
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
                  control={register.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
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
                  disabled={isRegistering}>
                  {isRegistering ? (
                    <>
                      <Loader2 className='animate-spin mr-3' /> Please Wait!
                    </>
                  ) : (
                    "Signup"
                  )}
                </Button>
              </form>
            </Form>
            {/* form end */}
          </CardContent>
          <CardFooter>
            <div className='text-center text-sm w-full'>
              Already Registered!
              <Link
                className='text-primary underline font-medium'
                href={"/login"}>
                {" "}
                Login Here
              </Link>
            </div>
          </CardFooter>
        </Card>
        {/* heading div end */}
      </div>
    </div>
  );
};
export default SignupPage;
