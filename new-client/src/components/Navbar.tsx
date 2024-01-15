import Image from 'next/image';
import Link from 'next/link';

import Search from '@/components/Search';

export default function Navbar() {
  return (
    <nav className='bg-[#032236] min-h-24 flex flex-col'>
      <div className='flex flex-row items-center gap-12'>
        <Image
          src='/appIcons/rikka_square_1024.png'
          width={64}
          height={64}
          alt='Logo'
        />

        <Search />
      </div>

      <ul className='flex flex-row gap-6 mx-auto text-white'>
        <li>
          <Link href='/popular'>Popular</Link>
        </li>
        <li>
          <Link href='/newest'>Newest</Link>
        </li>
        <li>
          <Link href='/updated'>Updated</Link>
        </li>
        <li>
          <Link href='/top-100'>Top 100</Link>
        </li>
        <li>
          <Link href='/random'>Random</Link>
        </li>
      </ul>
    </nav>
  );
}
