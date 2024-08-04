import CarouselComponent from "@/components/CarouselComponent";
import { Heading } from "@/components/ui/Heading";
import { Paragraph } from "@/components/ui/Paragraph";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Anonymous Feedback",
  description: "Anonymous Feedback App",
};
const HomePage = () => {
  return (
    <div>
      {/* heading section */}
      <div className='max-w-5xl mx-auto text-center my-8'>
        <Heading size='h1'>Welcome to Anonymous Feedback App</Heading>
        <Paragraph
          variant={"darkMuted"}
          className='pt-5'>
          Your anonymous opinions matter—help us improve by sharing your honest
          feedback.
        </Paragraph>
      </div>

      {/* carousel */}
      <CarouselComponent />
      <footer className='absolute -bottom-14 sm:bottom-0 w-screen py-4 bg-card text-center'>
        <Paragraph variant='darkMuted'>
          © 2024 Anonymous Feedback. All rights reserved.
        </Paragraph>
      </footer>
    </div>
  );
};
export default HomePage;
