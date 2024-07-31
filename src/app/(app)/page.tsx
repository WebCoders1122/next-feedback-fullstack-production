"use client";
import H2 from "@/components/ui/H2";
import H3 from "@/components/ui/H3";
import P from "@/components/ui/P";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
//messages
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
      <div className='mx-auto max-w-2xl'>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[Autoplay({ delay: 4000 })]}
          orientation='vertical'
          className='w-full mt-20'>
          <CarouselContent className='-mt-1 h-[170px]'>
            {messagese.map((message, index) => (
              <CarouselItem
                key={index}
                className='pt-1 md:basis-1/2'>
                <div className='p-1'>
                  <Card>
                    <CardContent className='flex flex-col items-center justify-center p-6'>
                      <H3>{message.title}</H3>
                      <p className='py-3'>{message.content}</p>
                      <p className='text-muted-foreground'>
                        {message.received}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <footer className='absolute bottom-0 w-screen py-4 bg-card text-center text-muted-foreground'>
        © 2024 AnonyFeedback. All rights reserved.
      </footer>
    </div>
  );
};
export default HomePage;
