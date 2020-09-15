import Link from 'next/link';
import classNames from 'classnames';

import TastiestLogo from '../assets/svgs/brand.svg';
import SearchIcon from '../assets/svgs/search-icon.svg';
import PlateSVG from '../assets/svgs/plate.svg';
import { MenuItem } from './MenuItem';

function NavBar() {
  return (
    <div className="contained">
      <div className="antialiased flex justify-between my-8">
        <div className="flex mb-2">
          <Link href="/">
            <a className="flex flex-shrink-0 text-primary">
              <TastiestLogo className="fill-current h-8" />
            </a>
          </Link>
        </div>

        <div className="flex mb-2 w-1/3 justify-end">
          <div
            className={classNames(
              'inline-flex',
              'items-center',
              'content-between',
              'border-2',
              'border-primary',
              'focus:shadow-outline',
              'focus:outline-none',
              'rounded-lg',
              'px-2',
              'h-8',
            )}
          >
            <input
              className={classNames(
                'pl-1',
                'border-none',
                'outline-none',
                'text-sm',
              )}
              placeholder={'Search'}
            />
            <Link href="/blog">
              <a className="flex flex-shrink-0">
                <SearchIcon className="fill-secondary h-6" />
              </a>
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full flex">
        <MenuItem text="Spanish" svg={<PlateSVG />} selected={false} />
        <MenuItem text="Italian" svg={<PlateSVG />} selected={false} />
        <MenuItem text="Chinese" svg={<PlateSVG />} selected={false} />
        <MenuItem text="Indian" svg={<PlateSVG />} selected={false} />
      </div>
    </div>
  );
}

export default NavBar;
