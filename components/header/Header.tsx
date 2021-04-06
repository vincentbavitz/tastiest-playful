import TastiestLogo from '@svg/brand.svg';
import SearchPrimarySVG from '@svg/search-primary.svg';
import clsx from 'clsx';
import Link from 'next/link';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UI } from '../../constants';
import { ScreenContext } from '../../contexts/screen';
import { expandSearchOverlay } from '../../state/navigation';
import { IState } from '../../state/reducers';
import { Contained } from '../Contained';
import { HeaderAvatar } from './HeaderAvatar';
import { HeaderSavedPlaces } from './HeaderSavedPlaces';
import { HeaderSearch } from './HeaderSearch';

export function Header() {
  const { isDesktop } = useContext(ScreenContext);
  const { onCheckoutPage } = useSelector((state: IState) => state.checkout);

  return (
    <div className="flex flex-col w-full">
      {onCheckoutPage ? (
        <CheckoutHeader isDesktop={isDesktop} />
      ) : (
        <div>{!isDesktop ? <MobileHeader /> : <DesktopHeader />}</div>
      )}
    </div>
  );
}

function MobileHeader() {
  const dispatch = useDispatch();

  const handleExpandSearch = (e: React.MouseEvent) => {
    // Timeout to prevent action immediately firing on the elemnt under with onMouseUp
    setTimeout(() => dispatch(expandSearchOverlay()), 50);
    e.stopPropagation();
  };

  return (
    <div
      style={{
        paddingLeft: '5vw',
        paddingRight: '5vw',
        height: `${UI.HEADER_HEIGHT_MOBILE_REM}rem`,
        zIndex: UI.Z_INDEX_HEADER,
      }}
      className="absolute top-0 left-0 right-0 w-full bg-white"
    >
      <div className="flex items-center justify-between w-full h-full">
        <div className="flex flex-shrink-0" onMouseDown={handleExpandSearch}>
          <SearchPrimarySVG className="h-10 cursor-pointer" />
        </div>

        <div className="antialiased">
          <Link href="/">
            <a className="flex items-center flex-shrink-0">
              <TastiestLogo className="h-8 fill-current text-primary" />
            </a>
          </Link>
        </div>

        <HeaderAvatar />
      </div>
    </div>
  );
}

function DesktopHeader() {
  const { searchOverlayExpanded } = useSelector(
    (state: IState) => state.navigation,
  );
  const { searchBarPinnedToHeader } = useSelector(
    (state: IState) => state.search,
  );

  // We only wnat the searchbar to be invisible on the home page
  // and given that they have not scrolled past the main home search
  const [searchIsShown, setSearchIsShown] = useState(false);
  useEffect(() => {
    if (
      (location.pathname === '/' && searchBarPinnedToHeader) ||
      location.pathname !== '/'
    ) {
      if (!searchIsShown) {
        setSearchIsShown(true);
      }
    } else {
      if (searchIsShown) {
        setSearchIsShown(false);
      }
    }
  }, [location.pathname, searchBarPinnedToHeader]);

  const navBarRef = useRef(null);

  return (
    <div
      ref={navBarRef}
      style={{
        zIndex:
          searchOverlayExpanded && searchIsShown
            ? UI.Z_INDEX_HEADER_SEARCH
            : UI.Z_INDEX_HEADER,
        height: `${UI.HEADER_HEIGHT_DESKTOP_REM}rem`,
      }}
      className="fixed top-0 left-0 right-0 flex items-center w-full bg-white"
    >
      <Contained>
        <div className="flex items-center w-full h-full">
          <div className="flex items-center justify-between w-full antialiased">
            <div className="flex flex-grow">
              <Link href="/">
                <a className="flex items-center flex-shrink-0">
                  <TastiestLogo className="h-8 fill-current text-primary" />
                </a>
              </Link>
              <HeaderSearch
                isShown={searchIsShown}
                innerOverlayStyle={{
                  // When pinned to header, limit height to vh and lock body scroll
                  maxHeight: searchIsShown ? '80vh' : 'unset',
                }}
              />
            </div>
            <HeaderSavedPlaces />
            <HeaderAvatar />
          </div>
        </div>
      </Contained>
    </div>
  );
}

function CheckoutHeader({ isDesktop }: { isDesktop: boolean }) {
  const InnerContent = () => (
    <div
      style={{
        height: `${
          isDesktop ? UI.HEADER_HEIGHT_DESKTOP_REM : UI.HEADER_HEIGHT_MOBILE_REM
        }rem`,
      }}
      className={clsx(
        'flex items-center w-full antialiased',
        isDesktop ? 'justify-between' : 'justify-center',
      )}
    >
      <div className="flex items-center flex-shrink-0 text-secondary">
        <TastiestLogo className="h-8 fill-current text-primary" />
      </div>
    </div>
  );

  return isDesktop ? (
    <Contained maxWidth={UI.CHECKOUT_WIDTH_PX}>
      <InnerContent />
    </Contained>
  ) : (
    <InnerContent />
  );
}
