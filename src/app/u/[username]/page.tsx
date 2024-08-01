"use client";
import H2 from "@/components/ui/H2";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@radix-ui/react-separator";
import axios, { AxiosError } from "axios";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
//react hook forms
import { useForm } from "react-hook-form";
import { ApiResponseInterface } from "../../../../types";
import { useToast } from "@/components/ui/use-toast";

const Upage = () => {
  const username: string = window.location.pathname.split("/")[2];
  //states
  const [isSendingMessage, setisSendingMessage] = useState(false);

  //toast
  const { toast } = useToast();

  //react hook forms
  const { register, handleSubmit, watch, setValue } = useForm();
  const onSubmit = async (data: any) => {
    setisSendingMessage(true);
    const reqBody = {
      username,
      content: data.textAreaValue,
    };
    try {
      const response = await axios.post<ApiResponseInterface>(
        "/api/send-message",
        reqBody
      );
      toast({
        title: "Success",
        description: response.data.message,
        variant: "success",
      });
      console.log(response.data);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseInterface>;
      return toast({
        title: "Failed",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setisSendingMessage(false);
    }
  };
  const textAreaValue = watch("textAreaValue");

  return (
    <div className='min-h-screen w-screen p-5 flex flex-col justify-between max-w-5xl mx-auto'>
      {/* section 1 */}
      <div>
        {/* Header section */}
        <div className='my-5'>
          <H2>Send Anonymus Messages to {username}</H2>
          <p className='text-gray-600 dark:text-gray-400 my-3'>
            Type your message below to send @{username} anonymusly...
          </p>
        </div>
        {/* textarea section */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='grid w-full gap-2'>
          <Textarea
            {...register("textAreaValue")}
            value={textAreaValue}
            placeholder='Type your message here.'
          />
          <p className='text-gray-600 dark:text-gray-400 mb-2 text-sm'>
            Your message should be at least 10 characters long.
          </p>
          <Button
            type='submit'
            disabled={isSendingMessage}
            className='w-fit'>
            {isSendingMessage ? (
              <>
                <LoaderCircle className='animate-spin mr-2' />
                <span>Sending Message</span>
              </>
            ) : (
              "Send message"
            )}
          </Button>
        </form>
      </div>
      {/* section 2 */}
      <div>
        <Button>Suggest Messages with AI</Button>
        <p className='text-gray-600 dark:text-gray-400 my-3'>
          Select Any Message below.
        </p>
        <Card>
          <CardHeader>
            <span className='text-xl'>Messages</span>
          </CardHeader>
          <CardContent className='flex flex-col items-center gap-3'>
            <Button
              onClick={(event) => {
                setValue("textAreaValue", event.currentTarget.textContent);
              }}
              size='flexible'
              variant='outline'
              className='w-full text-wrap py-1'>
              Hi there! I hope you don't mind me reaching out anonymously. I've
              been wanting to chat with you for a while.
            </Button>
            <Button
              onClick={(event) => {
                setValue("textAreaValue", event.currentTarget.textContent);
              }}
              className='w-full text-wrap py-1'
              variant='outline'
              size='flexible'>
              Hey, it's me - your secret admirer. I thought it might be fun to
              have an anonymous conversation. What's on your mind?
            </Button>
            <Button
              onClick={(event) => {
                setValue("textAreaValue", event.currentTarget.textContent);
              }}
              className='w-full text-wrap py-1'
              variant='outline'
              size='flexible'>
              Hello! I know this is a bit unconventional, but I wanted to
              introduce myself anonymously.
            </Button>
          </CardContent>
        </Card>
      </div>
      {/* create account section */}
      <div className='text-center flex flex-col gap-2 items-center'>
        <Separator />
        <p>Get Anonymus Feedback for you!</p>
        <Link href='/signup'>
          <Button>Create Account</Button>
        </Link>
      </div>
    </div>
  );
};
export default Upage;
