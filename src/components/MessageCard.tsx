"use client";
import { Trash } from "lucide-react";
// shadcn imports
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios, { AxiosError } from "axios";
import { ApiResponseInterface, MessageInterface } from "../../types";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useToast } from "./ui/use-toast";

type Props = {
  message: MessageInterface;
  onMessageDelete: (messageID: string) => void;
};
const MessageCard = ({ message, onMessageDelete }: Props) => {
  const { toast } = useToast();

  //function to delete the message from DB
  const handleMessageDelete = async () => {
    onMessageDelete(message?._id as string);
    try {
      const response = await axios.delete<ApiResponseInterface>(
        `/api/delete-message/${message._id}`
      );
      toast({
        title: "Message Deleted",
        description: response.data.message,
        variant: "success",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseInterface>;
      console.log(error);
      toast({
        title: "Error While Deleting Message",
        description:
          axiosError.response?.data.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className='max-w-lg flex flex-col justify-between'>
      <CardContent className='flex flex-col justify-start'>
        <div className='flex items-center justify-between gap-10'>
          <h3 className='text-start pt-5 mb-2 text-xl font-medium'>
            {message?.content}
          </h3>
        </div>
      </CardContent>
      <CardFooter className='flex py-3 bg-muted gap-3 flex-col xsm:flex-row items-center justify-around'>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className='px-2 w-full xsm:w-fit'
              variant='destructive'>
              <Trash className='mr-2' /> Delete Message
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className='rounded-xl px-10 max-w-[90vw] sm:max-w-lg'>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete
                message data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleMessageDelete}
                className='bg-destructive'>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <span className='text-muted-foreground text-sm text-center'>
          Created At: {new Date(message?.createAt).toLocaleDateString()}
        </span>
      </CardFooter>
    </Card>
  );
};
export default MessageCard;
