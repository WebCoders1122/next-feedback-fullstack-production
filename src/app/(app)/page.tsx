"use client";
import { Heading } from "@/components/ui/Heading";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Paragraph } from "@/components/ui/Paragraph";
import messagese from "@/messages.json";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";

const HomePage = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000 }),
  ]);
  return (
    <div>
      {/* heading section */}
      <div className='max-w-5xl mx-auto text-center my-8'>
        <Heading size='h1'>Welcome to Anonymus Feedback App</Heading>
        <Paragraph
          variant={"darkMuted"}
          className='pt-5'>
          Your anonymous opinions matter—help us improve by sharing your honest
          feedback.
        </Paragraph>
      </div>
      {/* carousel section */}
      <div className='mx-auto max-w-2xl mt-16'>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[Autoplay({ delay: 4000 })]}
          orientation='vertical'
          className='w-[95%] mx-auto'>
          <CarouselContent className='-mt-1 h-[270px] xsm:h-[210px] sm:h-[185px]'>
            {messagese.map((message, index) => (
              <CarouselItem
                key={index}
                className='pt-1 md:basis-1/2'>
                <div className='p-1 h-full'>
                  <Card className='flex flex-col justify-between -gap-5 h-[250px] xsm:h-[190px] sm:h-[170px]'>
                    <CardHeader>
                      <Heading
                        size={"h3"}
                        className='text-center'>
                        {message.title}
                      </Heading>
                    </CardHeader>
                    <CardContent className='flex flex-col items-center justify-evenly'>
                      <Paragraph>{message.content}</Paragraph>
                    </CardContent>
                    <CardFooter className='flex flex-col justify-center'>
                      <Paragraph variant='darkMuted'>
                        {message.received}
                      </Paragraph>
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='' />
          <CarouselNext className='' />
        </Carousel>
      </div>
      <footer className='absolute -bottom-14 sm:bottom-0 w-screen py-4 bg-card text-center'>
        <Paragraph variant='darkMuted'>
          © 2024 AnonyFeedback. All rights reserved.
        </Paragraph>
      </footer>
    </div>
  );
};
export default HomePage;
