import classNames from 'classnames';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useKey, useLocation, useMedia } from 'react-use';
import SpaghettiSVG from '../../assets/svgs/cuisines/italian.svg';
import XiaoSVG from '../../assets/svgs/cuisines/xiao.svg';
import NewSVG from '../../assets/svgs/hot.svg';
import NearbySVG from '../../assets/svgs/location.svg';
import TrendingSVG from '../../assets/svgs/trending.svg';
import { CUISINES, UI } from '../../constants';
import { useScreenSize } from '../../hooks/screen';
import { collapseSearchOverlay } from '../../state/navigation';
import { IState } from '../../state/reducers';
import { OutlineBlock } from '../OutlineBlock';
import { Search } from './Search';

// TODO - FIX:
// Warning: Did not expect server HTML to contain a <div> in <div>.
export function SearchOverlay() {
  const navigationState = useSelector((state: IState) => state.navigation);
  const searchState = useSelector((state: IState) => state.search);
  // const renderSearchTemplate = searchState.searchResultItems.length === 0;
  const { searchOverlayExpanded } = navigationState;

  // Pull into the location context of search bar
  const searchBarGeometry = searchState.searchBarGeometry;
  const dispatch = useDispatch();

  const { isMobile } = useScreenSize();

  const overlayContentRef = useRef(null);
  const onClickAway = () => {
    if (!isMobile && searchOverlayExpanded) {
      dispatch(collapseSearchOverlay());
    }
  };

  // Close on escape
  useKey('Escape', () => dispatch(collapseSearchOverlay()));

  // Close search overlay on page changed
  const location = useLocation();
  useEffect(() => {
    dispatch(collapseSearchOverlay());
  }, [location]);

  const mobileOverlayStyles = {
    zIndex: searchOverlayExpanded ? 20000 : -1,
  };

  // Desktop overlay styles depend on wether or not the search bar is
  // in the navbar or not
  const desktopOverlayStyles = {
    zIndex: searchOverlayExpanded ? 20001 : -1,
    display: searchOverlayExpanded ? 'block' : 'none',
    minHeight: '600px',

    top: `${searchBarGeometry.top + searchBarGeometry.height}px`,
    bottom: `${searchBarGeometry.bottom}px`,
    left: `${searchBarGeometry.left}px`,
    right: `${searchBarGeometry.right}px`,
    width: `${searchBarGeometry.width}px`,
  };

  return (
    <div>
      {isMobile ? (
        <div
          style={mobileOverlayStyles}
          className={classNames(
            'fixed top-0 bottom-0 left-0 right-0 bg-white',
            searchOverlayExpanded ? 'block' : 'hidden',
          )}
        >
          <div className="flex flex-col h-full flex-grow overflow-y-scroll">
            <Search
              placeholder="Search"
              autofocus={searchOverlayExpanded}
              renderExitButton={true}
            />
            <OverlayElement />
          </div>
        </div>
      ) : (
        <>
          <div
            onClick={onClickAway}
            style={{ zIndex: searchOverlayExpanded ? 20000 : -1 }}
            className={classNames(
              'fixed',
              'bottom-0',
              'left-0',
              'right-0',
              'h-full',
              'w-full',
              'bg-white',
              'bg-opacity-75',
              'transition-opacity',
              'duration-300',
              searchOverlayExpanded ? 'opacity-100' : 'opacity-0',
            )}
          ></div>

          <div
            className="absolute"
            ref={overlayContentRef}
            style={desktopOverlayStyles}
          >
            <div
              className={classNames(
                'relative',
                'flex',
                // Allows shadow to overflow
                'bg-white',
                'border-primary',
                'border-t-none',
                'border-l-2',
                'border-r-2',
                'border-b-2',
                'rounded-b-lg',
                'pb-4',
              )}
            >
              <div className="relative overflow-y-scroll w-full">
                <OverlayElement />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function OverlayElement() {
  const searchState = useSelector((state: IState) => state.search);
  const renderSearchTemplate =
    searchState?.searchResultItems?.length === 0 ?? true;

  const { isMobile } = useScreenSize();

  return (
    <div>
      <div
        className={classNames(
          'w-full px-4 pb-6',
          isMobile && 'flex flex-col h-full justify-between mt-3',
        )}
      >
        <div className="w-full border-secondary border-opacity-50 border-t-2"></div>

        {/* FEATURED DYNAMIC CATEGORIES */}
        <div className="flex flex-col space-y-1 mt-4">
          <span className="flex items-center text-lg text-primary font-roboto">
            <NearbySVG className="h-8 mr-2" />
            Nearby
          </span>
          <span className="flex items-center text-lg text-primary font-roboto">
            <TrendingSVG className="h-8 mr-2" />
            Trending
          </span>
          <span className="flex items-center text-lg text-primary font-roboto">
            <NewSVG className="h-8 mr-2" />
            New
          </span>
        </div>

        {/* CUISINES */}
        <div className="flex flex-col mt-6">
          <span className="text-black text-sm font-semibold tracking-wide ml-1">
            Find your next favourite dish!
          </span>

          <div className="flex flex-wrap space-x-2 ml-1 mt-2">
            {/* Get 5 most popular cuisines */}
            {Object.values(CUISINES)
              .sort((a, b) => b.popularity - a.popularity)
              .slice(0, 5)
              .map(cuisine => (
                <OutlineBlock size="small" key={cuisine.name}>
                  {cuisine.name}
                </OutlineBlock>
              ))}
          </div>
        </div>

        {/* POPULAR DISHES */}
        <div className="flex flex-col mt-6">
          <span className="text-black text-sm font-semibold tracking-wide ml-1">
            Popular dishes
          </span>

          <div className="flex flex-col space-y-2">
            <div className="flex space-x-2 items-center w-full border-b border-secondary py-2">
              <SpaghettiSVG className="h-10" />
              <span className="text-primary">Best Spaghetti</span>
            </div>

            <div className="flex space-x-2 items-center w-full border-b border-secondary py-2">
              <XiaoSVG className="h-10" />
              <span className="text-primary">Best Xiao Long Bao</span>
            </div>

            <div className="flex space-x-2 items-center w-full border-b border-secondary py-2">
              <SpaghettiSVG className="h-10" />
              <span className="text-primary">Best Sushi</span>
            </div>
          </div>
        </div>

        {renderSearchTemplate ? (
          <div className="flex justify-between items-center px-6 my-10">
            <h3 className="text-threexl">
              See more <Link href="">results</Link>
            </h3>
          </div>
        ) : (
          // <div className="flex w-full flex-wrap px-2 my-4">
          //   {searchState.searchResultItems.length &&
          //     searchState.searchResultItems.slice(0, 4).map(searchItem => (
          //       <div
          //         className={classNames('flex', isMobile ? ' w-full' : 'w-1/2')}
          //         key={searchItem.title.replace(' ', '-')}
          //       >
          //         <SearchItem {...searchItem} />
          //       </div>
          //     ))}
          // </div>
          <>fdsf</>
        )}

        <div className="flex flex-col w-full px-6">
          <Link
            href={{
              pathname: '/search',
              query: { s: searchState.searchQuery },
            }}
          >
            <h3 className="text-xl cursor-pointer text-center mt-4 mb-4">
              See all results
            </h3>
          </Link>
        </div>
      </div>
    </div>
  );
}
