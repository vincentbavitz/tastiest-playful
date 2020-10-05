import Link from 'next/link';
import React from 'react';
import YummySVG from '../assets/svgs/logo.svg';
import TastiestSVG from '../assets/svgs/tastiest.svg';

export function Footer() {
  return (
    <div className="bg-primary text-white py-6 text-center">
      <div className="contained font-robotolight text-sm">
        <div className="flex justify-center mt-2 mb-6 cursor-pointer">
          <Link href="/">
            <TastiestSVG className="h-6 fill-white" />
          </Link>
        </div>
        <div className="flex flex-col mt-3">
          <Link href="/">
            <a className="mb-1 mt-0">HOME</a>
          </Link>
          <Link href="/tastiest-for-restaurants">
            <a className="mb-1 mt-0">TASTIEST FOR RESTAURANTS</a>
          </Link>
          <Link href="/about">
            <a className="mb-1 mt-0">ABOUT US</a>
          </Link>
        </div>
        <Link href="/">
          <div className="flex justify-center w-full mt-3 cursor-pointer">
            <YummySVG className="h-10 fill-white mt-2" />
          </div>
        </Link>
      </div>
    </div>
  );
}
