"use client";
import H2 from "@/components/ui/H2";
import H3 from "@/components/ui/H3";
import P from "@/components/ui/P";
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

import messagese from "@/messages.json";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const HomePage = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000 }),
  ]);
  return (
    <div>
      {/* heading section */}
      <div className='max-w-5xl mx-auto text-center my-8'>
        <H2>Welcome to Anonymus Feedback App</H2>
        <P className='text-muted-foreground text-lg'>
          Your anonymous opinions matter—help us improve by sharing your honest
          feedback.
        </P>
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
          <CarouselContent className='-mt-1 h-[270px] xsm:h-[210px] sm:h-[190px]'>
            {messagese.map((message, index) => (
              <CarouselItem
                key={index}
                className='pt-1 md:basis-1/2'>
                <div className='p-1 h-full'>
                  <Card className='flex flex-col justify-between -gap-5 h-[250px] xsm:h-[190px] sm:h-[170px]'>
                    <CardHeader>
                      <H3>{message.title}</H3>
                    </CardHeader>
                    <CardContent className='flex flex-col items-center justify-evenly'>
                      <p>{message.content}</p>
                    </CardContent>
                    <CardFooter className='flex flex-col justify-center'>
                      <p className='text-muted-foreground'>
                        {message.received}
                      </p>
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
      <footer className='absolute -bottom-14 sm:bottom-0 w-screen py-4 bg-card text-center text-muted-foreground'>
        © 2024 AnonyFeedback. All rights reserved.
      </footer>
    </div>
  );
};
export default HomePage;
