import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Manga Reader',
};

export default function Home() {
  return (
    <>
      <Navbar />

      <div className='h-[70vh] bg-white overflow-hidden'>
        <Image
          src='https://image.tmdb.org/t/p/original/iiGtoYxmKFq85i0C196veQJtyVB.jpg'
          className='w-full h-full object-cover pointer-events-none'
          width={1920}
          height={1080}
          alt='Backdrop image'
        />
      </div>
    </>
  );
}
