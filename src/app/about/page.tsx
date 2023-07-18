import Image from 'next/image';
import { FC } from 'react';

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className='flex flex-col items-center mt-8 min-h-screen'>
      <h1 className='text-4xl'>Infrastructure</h1>
      <Image
        src='/infrastructure.png'
        alt='Infrastructure'
        width={600}
        height={800}
        layout='responsive'
        className='mt-6'
      />
    </div>
  );
};

export default page;
