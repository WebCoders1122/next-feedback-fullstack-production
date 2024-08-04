"use client";

import { Heading } from "./ui/Heading";
import { Paragraph } from "./ui/Paragraph";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import messages from "@/messages.json";
//autoplay of carousel with loop
import Autoplay from "embla-carousel-autoplay";
const CarouselComponent = () => {
  return (
    <>
      {" "}
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
            {messages.map((message, index) => (
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
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </>
  );
};
export default CarouselComponent;

//TODO: remove this from entire app "className=''"
