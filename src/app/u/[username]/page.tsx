"use client";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@radix-ui/react-separator";
import axios, { AxiosError } from "axios";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
//react hook forms
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { ApiResponseInterface } from "../../../../types";
//vercel ai
import { Skeleton } from "@/components/ui/skeleton";
import { anonymusMessageSchema } from "@/schemas/anonymusMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCompletion } from "ai/react";
import { z } from "zod";
import { Paragraph } from "@/components/ui/Paragraph";
import PageMetaData from "@/components/PageMetaData";

const Upage = () => {
  const username: string = window.location.pathname.split("/")[2];
  //states
  const [isSendingMessage, setisSendingMessage] = useState(false);

  // to trun ai stream into text
  const initialCompletion = `Hi there! I hope you don't mind me reaching out anonymously. I've been wanting to chat with you for a while. || Hey, it's me - your secret admirer. I thought it might be fun to have an anonymous conversation. What's on your mind? || Hello! I know this is a bit unconventional but I wanted to introduce myself anonymously.`;
  const {
    complete,
    completion,
    isLoading: isLoadingAIMessages,
  } = useCompletion({
    api: "/api/ai-messages",
    initialCompletion: initialCompletion,
  });

  //toast
  const { toast } = useToast();

  //react hook forms
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof anonymusMessageSchema>>({
    resolver: zodResolver(anonymusMessageSchema),
  });
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
      setValue("textAreaValue", "");
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

  // //to generate ai messaes
  const generateAIMessages = () => {
    try {
      complete("");
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed",
        description: "Failed to generate messages",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <PageMetaData
        title='Anonymous Public Link'
        description='This is Anonymous Public Link Page for Anonymous Feedback'
      />
      <div className='p-5 max-w-5xl mx-auto'>
        {/* section 1 */}
        <div className='my-5'>
          {/* Header section */}
          <div className='my-5'>
            <Heading>
              Send Anonymous Messages to{" "}
              <span className='uppercase text-primary'>{username}</span>
            </Heading>
            <p className='text-gray-600 dark:text-gray-400 my-3'>
              Type your message below to send @{username} anonymously...
            </p>
          </div>
          {/* textarea section */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='grid w-full gap-2'>
            <Textarea
              className='mb-2'
              rows={5}
              {...register("textAreaValue")}
              value={textAreaValue}
              placeholder='Type your message here.'
            />
            {errors.textAreaValue && (
              <span className='text-red-500 text-sm'>
                {errors.textAreaValue.message}
              </span>
            )}
            <Button
              type='submit'
              disabled={isSendingMessage}
              className='w-full xsm:w-fit'>
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

        <Separator className='border-b' />
        {/* section 2 */}
        <div className='my-5'>
          <Button
            className='w-full xsm:w-fit'
            disabled={isLoadingAIMessages}
            onClick={generateAIMessages}>
            {isLoadingAIMessages ? (
              <>
                <LoaderCircle className='animate-spin mr-2' />
                <span>Generating Messages...</span>
              </>
            ) : (
              "Suggest Messages with AI"
            )}
          </Button>
          <p className='text-gray-600 dark:text-gray-400 my-3'>
            Select Any Message below.
          </p>
          <Card className='my-5'>
            <CardHeader>
              <span className='text-xl'>Messages</span>
            </CardHeader>
            <CardContent className='flex flex-col items-center gap-3'>
              {completion ? (
                completion.split("||").map((message, index) => (
                  <Button
                    key={index + "ai-message"}
                    onClick={(event) => {
                      setValue(
                        "textAreaValue",
                        event.currentTarget.textContent!
                      );
                      window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: "smooth",
                      });
                    }}
                    size='flexible'
                    variant='outline'
                    className='w-full text-wrap'>
                    {message.trim()}
                  </Button>
                ))
              ) : (
                <>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className='w-full h-12'
                    />
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        </div>
        {/* create account section */}
        <div className='text-center flex flex-col gap-2 items-center'>
          <Separator />
          <Paragraph>Get Anonymous Feedback for you!</Paragraph>
          <Link
            href='/signup'
            className="w-full xsm:w-fit'">
            <Button className='w-full xsm:w-fit'>Create Account</Button>
          </Link>
        </div>
      </div>
    </>
  );
};
export default Upage;

//TODO: make default mode system dark or light mode
//TODO: add custom logo / Favicon
