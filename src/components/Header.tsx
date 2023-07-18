import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  return (
    <div className='w-full mx-auto bg-slate-400 shadow-md px-8 py-1 text-zinc-700'>
      <div className='flex items-center justify-between'>
        <Link href='/' className='flex items-center justify-center py-2 gap-2'>
          <Image
            src='/weather_app_icon.png'
            alt='app icon'
            width={50}
            height={50}
          />
          <div className='text-base md:text-2xl font-semibold'>Weather App</div>
        </Link>
        <div className='flex items-center space-x-4'>
          <Link href='/' className='md:text-xl'>
            Home
          </Link>
          <Link href='/about' className='md:text-xl'>
            About
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
