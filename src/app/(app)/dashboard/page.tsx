"use client";
import MessageCard from "@/components/MessageCard";
import PageMetaData from "@/components/PageMetaData";
import { Heading } from "@/components/ui/Heading";
import { Paragraph } from "@/components/ui/Paragraph";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { RotateCw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ApiResponseInterface, MessageInterface } from "../../../../types";

const Dashboard = () => {
  //state for isAcceptMessagesLoading
  const [isAcceptMessagesLoading, setIsAcceptMessagesLoading] = useState(false);
  const [isFetchigMessage, setIsFetchigMessage] = useState(false);
  const [messages, setMessages] = useState<MessageInterface[]>([]);

  //toast
  const { toast } = useToast();

  //session
  const { data: session } = useSession();
  const user = session?.user as User;

  //for make react-hook-form instance
  const form = useForm();
  const { register, setValue, watch } = form;
  const acceptingMessageState = watch("acceptingMessageState");

  //for making url
  const userUrl = `https://feedback-ashen-nine.vercel.app/u/${user?.username}`;

  //getting isAcceptingMessage sate from server
  const getIsAcceptingMessages = async () => {
    setIsAcceptMessagesLoading(true);
    try {
      const response = await axios.get<ApiResponseInterface>(
        "/api/accept-message-status"
      );
      setValue("acceptingMessageState", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseInterface>;
      toast({
        title: "Failed",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsAcceptMessagesLoading(false);
    }
  };

  //setting isAcceptingMessage sate to server
  const setIsAcceptingMessages = useCallback(
    async (isAcceptingMessages: boolean) => {
      try {
        const response = await axios.patch<ApiResponseInterface>(
          "/api/accept-message-status",
          { isAcceptingMessages }
        );
        setValue("acceptingMessageState", isAcceptingMessages);
        toast({
          title: "Success",
          description: response.data.message,
          variant: "success",
        });
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponseInterface>;
        toast({
          title: "Failed",
          description: axiosError.response?.data.message,
          variant: "destructive",
        });
      }
    },
    [setValue, toast]
  );

  // copy url to clipboard
  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(userUrl);
    toast({
      title: "Success",
      description: "URL copied to clipboard",
      variant: "success",
    });
  };

  // getting messages from DB
  const getMessages = useCallback(async () => {
    setIsFetchigMessage(true);
    try {
      const response = await axios.get<ApiResponseInterface>(
        "/api/get-messages"
      );
      console.log(response);
      const fetchedMessages = response?.data?.messages;
      fetchedMessages?.length === 0
        ? toast({
            title: "Failed",
            description: "No messages found",
            variant: "destructive",
          })
        : setMessages(fetchedMessages!);
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ApiResponseInterface>;
      toast({
        title: "Failed",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsFetchigMessage(false);
    }
  }, [toast]);

  // initializing dashboard
  useEffect(() => {
    if (!session) return;
    getIsAcceptingMessages();
    getMessages();
  }, [session]);

  //Optimistic UI stretegy for remving from UI
  const onMessageDelete = (messageID: string) => {
    const newMessages = messages.filter((message) => {
      return message._id !== messageID;
    });
    setMessages(newMessages);
  };
  return (
    <>
      <PageMetaData
        title={`${user?.username} Dashboard`}
        description={`This is ${user?.username} Dashboard`}
      />
      <div className='max-w-5xl flex flex-col justify-center p-4 mx-auto'>
        <Heading variant='darkMuted'>
          Welcome{" "}
          <span className='text-primary uppercase mx-1'>{user?.username}</span>{" "}
          to Dashboard
        </Heading>
        {/* 1st section */}
        <Paragraph
          variant='darkMuted'
          className='mt-3'>
          Copy your unique link and share with other to get anonymous feedback!
        </Paragraph>
        <div className='w-full my-3 gap-3 flex flex-col xsm:flex-row items-center justify-between'>
          <input
            type='text'
            value={userUrl}
            disabled
            className='text-muted-foreground w-full rounded-sm py-1.5 bg-muted px-3 border-none outline-none'
          />
          <Button
            className='w-full xsm:w-fit'
            onClick={copyUrlToClipboard}>
            Copy URL
          </Button>
        </div>
        <Separator className='my-5' />
        {/* 2nd section */}
        <div className='w-full'>
          <div className='flex items-center gap-2'>
            <Switch
              {...register}
              onCheckedChange={(checked) => setIsAcceptingMessages(checked)}
              disabled={isAcceptMessagesLoading}
              checked={acceptingMessageState}
            />
            <span>
              Accepting messages: {acceptingMessageState ? "On" : "Off"}
            </span>
          </div>
          <Separator className='my-2' />
          <>
            {messages && messages.length > 0 ? (
              <div className='grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-4 mt-8 mx-auto w-fit'>
                {messages.map((message) => (
                  <MessageCard
                    key={message._id}
                    message={message}
                    onMessageDelete={onMessageDelete}
                  />
                ))}
              </div>
            ) : (
              <div className=' w-full mx-auto p-5'>
                <Card className=' w-fit rounded-sm py-2 px-4 mb-2'>
                  <RotateCw
                    onClick={getMessages}
                    className={`text-muted-foreground ${
                      isFetchigMessage ? "animate-spin" : ""
                    }`}
                  />
                </Card>
                <Paragraph>no messages to display</Paragraph>
              </div>
            )}
          </>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
