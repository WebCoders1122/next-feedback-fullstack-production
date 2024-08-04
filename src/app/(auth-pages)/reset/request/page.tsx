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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ApiResponseInterface } from "../../../../../types";
import { Paragraph } from "@/components/ui/Paragraph";
import { emailSchema } from "@/schemas/emailSchema";
import PageMetaData from "@/components/PageMetaData";

const RequestPasswordResetPage = () => {
  // for loading spinner
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  // getting params
  const router = useRouter();
  const { toast } = useToast();

  // verify from defination
  const request = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
  });

  // submit handlet
  const onSubmit = async (data: z.infer<typeof emailSchema>) => {
    setIsSendingRequest(true);
    try {
      const response = await axios.post<ApiResponseInterface>(
        "/api/reset-password/request",
        {
          email: data.email,
        }
      );
      toast({
        title: "Success",
        description: response.data.message,
        variant: "success",
      });
      //TODO: replace instead of push
      router.push(`/reset/verify/${response.data.username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseInterface>;
      console.log(axiosError.response);
      toast({
        title: "Verification Failed",
        description:
          axiosError.response?.data.message ??
          "Something went wrong in Resetting Password",
        variant: "destructive",
      });
    } finally {
      setIsSendingRequest(false);
    }
  };
  return (
    <>
      <PageMetaData
        title='Reset Password - Anonymous Feedback'
        description='This is Reset Password Page for Anonymous Feedback'
      />
      <div className='bg-background sm:min-h-[80vh] max-w-[480px] mx-auto p-5 flex justify-center items-center'>
        <div>
          {/* heading div started */}
          <Card>
            <CardHeader>
              <Heading>Reset Your Password</Heading>
              <Paragraph
                variant='darkMuted'
                className='text-center py-3'>
                Please enter your email to get verification code for resetting
                password.
              </Paragraph>
            </CardHeader>
            <CardContent>
              {/* form started */}
              <Form {...request}>
                <form
                  onSubmit={request.handleSubmit(onSubmit)}
                  className='space-y-6 '>
                  <FormField
                    name='email'
                    control={request.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder='Enter Your Email'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    className='w-full space-y-6 font-medium text-sm'
                    type='submit'
                    disabled={isSendingRequest}>
                    {isSendingRequest ? (
                      <>
                        <Loader2 className='animate-spin mr-3' /> Requesting
                        Verification Code!
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
    </>
  );
};

export default RequestPasswordResetPage;

//TODO: add metadata
//TODO: error and loading page
