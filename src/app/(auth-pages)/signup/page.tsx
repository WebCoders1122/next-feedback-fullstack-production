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
import { Heading } from "@/components/ui/Heading";
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

import PageMetaData from "@/components/PageMetaData";
import { Paragraph } from "@/components/ui/Paragraph";
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
  const [matchPassword, setMatchPassword] = useState<null | boolean>(null);

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
      verify_password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setMatchPassword(null);
    if (values.password !== values.verify_password) {
      setMatchPassword(false);
      return;
    }
    setMatchPassword(true);
    setIsRegistering(true);
    try {
      const response = await axios.post<ApiResponseInterface>(
        "/api/signup",
        values
      );
      toast({
        title: "Success",
        description: response.data.message,
        variant: "success",
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseInterface>;
      console.log(error);
      const errorMessage =
        axiosError.response?.data.message ?? "Registeration Failed";
      toast({
        title: "Failed",
        description: errorMessage,
        variant: "destructive",
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
    <>
      <PageMetaData
        title='Sign Up'
        description='This is Sign Up Page for Anonymous Feedback'
      />
      <div className='bg-background sm:min-h-[80vh] max-w-[480px] mx-auto p-5 flex justify-center items-center'>
        <div>
          {/* heading div started */}
          <Card>
            <CardHeader>
              <Heading variant='default'>Signup to Anonymous Feedback</Heading>
              <Paragraph>Pleae signup to get started</Paragraph>
            </CardHeader>
            <CardContent>
              {/* form started */}
              <Form {...register}>
                <form
                  onSubmit={register.handleSubmit(onSubmit)}
                  className='space-y-4 '>
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
                  <FormField
                    name='verify_password'
                    control={register.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verify Password</FormLabel>
                        <FormControl>
                          <Input
                            type='password'
                            placeholder='Verify your password here'
                            {...field}
                          />
                        </FormControl>
                        {matchPassword === false ? (
                          <Paragraph
                            variant='destructive'
                            size='sm'>
                            Password doesn&apos;t match
                          </Paragraph>
                        ) : null}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
    </>
  );
};
export default SignupPage;
