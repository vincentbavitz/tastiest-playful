import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMedia } from 'react-use';
import { SEARCH, UI } from '../../constants';
import { IState } from '../../state/reducers';
import { Search } from './Search';
import { SearchItem } from './SearchItem';

export function SearchOverlay() {
  const navigationState = useSelector((state: IState) => state.navigation);
  const searchState = useSelector((state: IState) => state.search);
  const renderSearchTemplate = searchState.searchResultItems.length === 0;
  const { searchOverlayExpanded } = navigationState;

  const dispatch = useDispatch();

  // Responsive
  let isMobile = true;
  if (typeof window !== 'undefined') {
    isMobile = useMedia(`(max-width: ${UI.MOBILE_BREAKPOINT}px)`);
  }

  // Styling
  const modalStyles = {
    overlay: {
      zIndex: '10000',
    },
    content: {
      top: 'unset',
      bottom: 'unset',
      left: 'unset',
      right: 'unset',
      width: '100%',
      minHeight: '100%',
      padding: '0',
    },
  };

  return (
    <>
      {isMobile ? (
        <div
          style={{ zIndex: searchOverlayExpanded ? 20000 : -1 }}
          className={classNames(
            'fixed top-0 bottom-0 left-0 right-0 bg-white',
            searchOverlayExpanded ? 'block' : 'hidden',
          )}
        >
          <div className="flex flex-col h-full flex-grow overflow-y-scroll">
            <Search autofocus={true} renderExitButton={true} />
            <OverlayElement />
          </div>
        </div>
      ) : (
        <>
          <div
            style={{ zIndex: searchOverlayExpanded ? 20000 : -1 }}
            className={classNames(
              'fixed',
              'top-0',
              'bottom-0',
              'left-0',
              'right-0',
              'bg-gray-800',
              'bg-opacity-50',
              'transition-opacity',
              'duration-300',
              searchOverlayExpanded ? 'opacity-100' : 'opacity-0',
            )}
          ></div>

          <div
            className={classNames(
              'relative',
              'h-0',
              'w-full',
              searchOverlayExpanded ? 'block' : 'hidden',
            )}
          >
            <div
              style={{ zIndex: 20000 }}
              className={classNames(
                'flex',
                'absolute',
                'top-0',
                // Allows shadow to overflow
                '-left-4',
                '-right-4',
                'w-full',
                'pb-10',
                'bg-white',
                'border-t',
                'rounded-b-lg',
              )}
            >
              <div className="overflow-y-scroll w-full">
                <OverlayElement />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function OverlayElement() {
  const navigationState = useSelector((state: IState) => state.navigation);
  const searchState = useSelector((state: IState) => state.search);
  const renderSearchTemplate = searchState.searchResultItems.length === 0;

  // Responsive
  let isMobile = true;
  if (typeof window !== 'undefined') {
    isMobile = useMedia(`(max-width: ${UI.MOBILE_BREAKPOINT}px)`);
  }

  // const { searchOverlayExpanded } = navigationState;
  // const dispatch = useDispatch();

  const shouldDisplaySeeAll =
    searchState.searchResultItems.length >=
    SEARCH.SOFT_LIMIT_SEARCH_RESULTS_OVERLAY;

  return (
    <>
      <div
        className={classNames(
          'search-items bottom-0 w-full h-full pb-10',
          isMobile && 'mt-3',
        )}
      >
        {renderSearchTemplate ? (
          <>SUGGESTIONS FOR YOU</>
        ) : (
          <div className="flex w-full flex-wrap px-2 mt-4">
            {searchState.searchResultItems.length &&
              searchState.searchResultItems.slice(0, 4).map(searchItem => (
                <div
                  className={classNames('flex', isMobile ? ' w-full' : 'w-1/2')}
                  key={searchItem.title.replace(' ', '-')}
                >
                  <SearchItem {...searchItem} />
                </div>
              ))}
          </div>
        )}

        {shouldDisplaySeeAll && (
          <div className="flex w-full px-6 my-4 text-lg ">
            <Link href="" as="">
              See all
            </Link>
          </div>
        )}

        <div className="flex flex-col w-full px-6">
          If we don't have an X, do the following, amazing copy from vince
          <div
            role="button"
            className="w-40 rounded-md py-2 px-4 text-white bg-primary text-center font-bold"
          >
            Click Here!
          </div>
        </div>

        {/* Spacing -- do not touch! */}
        <div className="h-8"></div>
      </div>
    </>
  );
}
