"use client";
import { X } from "lucide-react";
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
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { ApiResponseInterface, MessageInterface } from "../../types";

type Props = {
  message: MessageInterface;
  onMessageDelete: (messageID: string) => void;
};
const MessageCard = ({ message, onMessageDelete }: Props) => {
  const { toast } = useToast();

  //function to delete the message from DB
  const handleMessageDelete = async () => {
    onMessageDelete(message._id as string);
    // try {
    //   const response = await axios.delete<ApiResponseInterface>(
    //     `/api/delete-message/${message._id}`
    //   );
    //   toast({
    //     title: "Message Deleted",
    //     description: response.data.message,
    //     variant: "success",
    //   });
    // } catch (error) {
    //   const axiosError = error as AxiosError<ApiResponseInterface>;
    //   console.log(error);
    //   toast({
    //     title: "Error While Deleting Message",
    //     description:
    //       axiosError.response?.data.message || "Something went wrong",
    //     variant: "destructive",
    //   });
    // }
  };

  return (
    <Card className='max-w-lg m-5'>
      <CardContent className='flex flex-col justify-start'>
        <div className='flex items-center justify-between gap-10'>
          <h3 className='text-start pt-5 mb-2'>{message.content}</h3>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className='px-2'
                variant='destructive'>
                <X className='w-5 h-5' />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
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
        </div>
        <span className='text-muted-foreground text-sm text-end'>
          Created At: {message.createAt.toLocaleDateString()}
        </span>
      </CardContent>
    </Card>
  );
};
export default MessageCard;

//TODO: delete all unused imports from every file
