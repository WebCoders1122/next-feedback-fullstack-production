"use client";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { User } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import H3 from "@/components/ui/H3";
import P from "@/components/ui/P";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import MessageCard from "@/components/MessageCard";
import { ApiResponseInterface, MessageInterface } from "../../../../types";

const initialState = [
  {
    _id: "1",
    content: "hello fried how are you",
    createAt: new Date(Date.now()),
  },
  {
    _id: "2",
    content: "hello fried how ahd alj af;wljk;laj sdf sldfja; f are you",
    createAt: new Date(Date.now()),
  },
  {
    _id: "3",
    content:
      "hello alkjf a asd;flaj sdf;;ljklkjasdh flasdklhl a fried how are you",
    createAt: new Date(Date.now()),
  },
  {
    _id: "4",
    content: "hello aksdfj al fried how are you",
    createAt: new Date(Date.now()),
  },
];

const Dashboard = () => {
  //state for isAcceptMessagesLoading
  const [isAcceptMessagesLoading, setIsAcceptMessagesLoading] = useState(false);
  const [fetchigMessage, setFetchigMessage] = useState(false);
  const [messages, setMessages] = useState<MessageInterface[]>([]);

  //toast
  const { toast } = useToast();

  //session
  const { data: session } = useSession();
  const user = session?.user as User;

  //for make react-hook-form instance
  const form = useForm();
  const { register, setValue, watch, handleSubmit } = form;
  const acceptingMessageState = watch("acceptingMessageState");

  //for making url
  const baseUrl = window.location.origin!;
  const userUrl = `${baseUrl}/u/${user?.username}`;

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
        toast({
          title: "Success",
          description: response.data.message,
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
    [setValue]
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
    setFetchigMessage(true);
    try {
      const response = await axios.get<ApiResponseInterface>(
        "/api/get-messages"
      );
      const fetchedMessages = response.data.messages;
      setMessages(fetchedMessages ?? []);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseInterface>;
      toast({
        title: "Failed",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setFetchigMessage(false);
    }
  }, []);
  // TODO:uncomment following code
  // initializing dashboard
  useEffect(() => {
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
    <div className='max-w-5xl flex flex-col justify-center p-10 mx-auto'>
      <H3 className='mb-3'>Welcome to User Dashboard</H3>
      {/* 1st section */}
      <p className='mx-2'>
        Copy your unique link and share with other to get feedback!
      </p>
      <Separator className='my-5' />
      <div className=' w-full gap-3 flex items-center justify-between'>
        <Input
          type='text'
          value={userUrl}
          readOnly
          className='text-muted-foreground '
        />
        <Button onClick={copyUrlToClipboard}>Copy URL</Button>
      </div>
      {/* 2nd section */}
      <div className='mt-20'>
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
        <div className='grid grid-flow-row grid-cols-2'>
          {messages &&
            messages.map((message) => (
              <MessageCard
                key={message._id}
                message={message}
                onMessageDelete={onMessageDelete}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;

//TODO: make all pages of website responsive
