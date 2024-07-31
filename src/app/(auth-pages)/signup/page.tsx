//signup nextjs page with username validation via zod
"use client";

import { signUpSchema } from "@/schemas/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
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
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiResponseInterface } from "../../../../types";

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
      const response = await axios.post<ApiResponseInterface>(
        "/api/signup",
        values
      );
      toast({
        title: response.data.message,
        variant: "success",
      });
      console.log(response);
      setTimeout(() => {
        router.push(`/verify/${username}`);
      }, 500);
      //TODO: remove this timout and push ==> replace
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseInterface>;
      console.log(error);
      const errorMessage =
        axiosError.response?.data.message ?? "Registeration Failed";
      toast({
        title: errorMessage,
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
        const response = await axios.get<ApiResponseInterface>(
          `/api/validate-username?username=${username}`
        );
        setIsvalidated(response.data.success);
        setValidationMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponseInterface>;
        setIsvalidated(axiosError.response?.data.success ?? false);
        setValidationMessage(
          axiosError.response?.data.message ?? "Username Validation Failed"
        );
      } finally {
        setIsCheckingUsernameValidation(false);
      }
    };
    checkUsernameValidation();
  }, [username]);
  return (
    <div className='bg-background sm:min-h-screen flex justify-center items-center'>
      <div className='w-full max-w-screen sm:max-w-md'>
        {/* heading div started */}
        <Card>
          <CardHeader>
            {/* TODO: try to adjust lineheight of heading and margin or paragraph in signup, login and verify pages */}
            <H2>Signup to Feedback App</H2>
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

//TODO: add error and loading pages for this path
