"use client";
//nextjs page to verify user with 6 digit code
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import H2 from "@/components/ui/H2";
import P from "@/components/ui/P";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ApiResponseInterface } from "../../../../../types";

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
      setTimeout(() => {
        router.push(`/login`);
      }, 500);
      //TODO: remove this timout and push ==> replace
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
    <div className='bg-background sm:min-h-screen flex justify-center items-center'>
      <div className='w-full max-w-screen sm:max-w-md'>
        {/* heading div started */}
        <Card>
          <CardHeader>
            <H2>Verify Account</H2>
            <p className='text-muted-foreground text-center py-3'>
              Please enter the 6-digit verification code that you received in
              your email.
            </p>
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
