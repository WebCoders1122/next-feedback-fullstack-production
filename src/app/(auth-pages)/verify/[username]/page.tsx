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

const VerifyPage = () => {
  // for loading spinner
  const [isVerifying, setIsVerifying] = useState(false);
  // getting params
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  // verify from defination
  const verify = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  // submit handlet
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    if (data.Code.length !== 6) {
      toast({
        title: "Verification Failed",
        description: "Verification code must be 6 digits",
        variant: "destructive",
      });
      return;
    }
    setIsVerifying(true);
    try {
      const response = await axios.patch<ApiResponseInterface>(
        "/api/verify-code",
        {
          username: params.username,
          codeToVerify: data.Code,
        }
      );
      toast({
        title: "Verification Successful",
        description: response.data.message,
        variant: "success",
      });
      router.replace(`/login`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseInterface>;
      console.log(axiosError.response);
      toast({
        title: "Verification Failed",
        description:
          axiosError.response?.data.message ??
          "Something went wrong in verification",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };
  return (
    <div className='bg-background sm:min-h-[80vh] max-w-[480px] mx-auto p-5 flex justify-center items-center'>
      <div>
        {/* heading div started */}
        <Card>
          <CardHeader>
            <Heading>Verify Account</Heading>
            <Paragraph
              variant='darkMuted'
              className='text-center py-3'>
              Please enter the 6-digit verification code that you received in
              your email.
            </Paragraph>
          </CardHeader>
          <CardContent>
            {/* form started */}
            <Form {...verify}>
              <form
                onSubmit={verify.handleSubmit(onSubmit)}
                className='space-y-6 '>
                <FormField
                  name='Code'
                  control={verify.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='Enter Verification Code'
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
                  disabled={isVerifying}>
                  {isVerifying ? (
                    <>
                      <Loader2 className='animate-spin mr-3' /> Verification in
                      Progress!
                    </>
                  ) : (
                    "Verify Code"
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

export default VerifyPage;

//TODO: add metadata
//TODO: error and loading page
