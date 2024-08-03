"use client";
//nextjs page to verify user with 6 digit code
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ApiResponseInterface } from "../../../../../types";
import { Paragraph } from "@/components/ui/Paragraph";
import { resetPasswordSchema } from "@/schemas/resetPasswordSchema";

const ResetPasswordPage = () => {
  // for loading spinner
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [matchPassword, setMatchPassword] = useState<null | boolean>(null);

  // getting params
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  // verify from defination
  const reset = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // submit handlet
  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setMatchPassword(null);
    if (data.password !== data.verify_password) {
      setMatchPassword(false);
      return;
    }
    setMatchPassword(true);
    setIsResettingPassword(true);
    try {
      const response = await axios.post<ApiResponseInterface>(
        "/api/reset-password/reset",
        {
          password: data.password,
          username: params.username,
        }
      );
      toast({
        title: "Success",
        description: response.data.message,
        variant: "success",
      });
      router.replace(`/login`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseInterface>;
      console.log(axiosError.response);
      toast({
        title: "Failed",
        description:
          axiosError.response?.data.message ??
          "Something went wrong in Resetting Password",
        variant: "destructive",
      });
    } finally {
      setIsResettingPassword(false);
    }
  };
  return (
    <div className='bg-background sm:min-h-[80vh] max-w-[480px] mx-auto p-5 flex justify-center items-center'>
      <div>
        {/* heading div started */}
        <Card>
          <CardHeader>
            <Heading>Reset Password</Heading>
          </CardHeader>
          <CardContent>
            {/* form started */}
            <Form {...reset}>
              <form
                onSubmit={reset.handleSubmit(onSubmit)}
                className='space-y-6 w-[360px]'>
                <FormField
                  name='password'
                  control={reset.control}
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
                  control={reset.control}
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
                          Password doesn't match
                        </Paragraph>
                      ) : null}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className='w-full space-y-6 font-medium text-sm'
                  type='submit'
                  disabled={isResettingPassword}>
                  {isResettingPassword ? (
                    <>
                      <Loader2 className='animate-spin mr-3' /> Password is
                      Resetting!
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </Form>
            {/* form end */}
          </CardContent>
        </Card>
        {/* heading div end */}
      </div>
    </div>
  );
};

export default ResetPasswordPage;

//TODO: add metadata
//TODO: error and loading page
