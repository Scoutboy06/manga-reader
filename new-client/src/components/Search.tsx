'use client';

import { useState } from 'react';

export default function Search() {
  const [value, setValue] = useState('');

  return (
    <form
      className='flex w-full h-10 overflow-hidden rounded-full'
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        className='w-full h-full px-4 text-white bg-[#415264] outline-none placeholder:text-white'
        type='text'
        name='search'
        id='search'
        placeholder='Search...'
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <button
        className='grid items-center w-12 text-white bg-transparent hover:bg-white hover:bg-opacity-10'
        type='submit'
      >
        <i className='icon'>search</i>
      </button>
    </form>
  );
}
