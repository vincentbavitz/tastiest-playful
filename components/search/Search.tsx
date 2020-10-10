import classNames from 'classnames';
import React, { ChangeEvent, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLockBodyScroll, useMeasure, useMedia } from 'react-use';
import BackSVG from '../../assets/svgs/back.svg';
import SearchSVG from '../../assets/svgs/search.svg';
import { UI } from '../../constants';
import {
  collapseSearchOverlay,
  expandSearchOverlay,
} from '../../state/navigation';
import { IState } from '../../state/reducers';
import {
  ISearchBarGeometry,
  setSearchBarGeometry,
  setSearchQuery,
  setSearchResultItems,
} from '../../state/search';
import { search } from '../../utils/search';

interface Props {
  renderExitButton?: boolean;
  autofocus?: boolean;
  onFocus?(): void;
}

export function Search(props: Props) {
  const nagivationState = useSelector((state: IState) => state.navigation);
  const searchState = useSelector((state: IState) => state.search);
  const dispatch = useDispatch();

  const { searchOverlayExpanded } = nagivationState;
  const { onFocus, autofocus = false } = props;

  // Responsive
  let isMobile = true;
  if (typeof window !== 'undefined') {
    isMobile = useMedia(`(max-width: ${UI.MOBILE_BREAKPOINT}px)`);
  }

  const inputValue = searchState.searchQuery;
  const renderExitButton = props.renderExitButton ?? isMobile;

  // Scroll locking
  useLockBodyScroll(searchOverlayExpanded && isMobile);

  // Exit when user clicks out of component
  const inputRef = useRef(null);
  const searchRef = useRef(null);
  const [searchMeasureRef, { width }] = useMeasure();

  // Handler Functions
  const handleFocus = () => {
    if (onFocus) {
      onFocus();
    }

    if (!searchOverlayExpanded) {
      dispatch(expandSearchOverlay());
    }
  };

  const handleExit = () => {
    dispatch(collapseSearchOverlay());
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    dispatch(setSearchQuery(String(value)));

    // Bring up overlay when they start typing
    if (String(value).length > 0) {
      dispatch(expandSearchOverlay());
    }
  };

  // Effects
  useEffect(() => {
    const fetchSearchItems = async () => {
      const query = String(inputValue);
      dispatch(setSearchResultItems(await search(query)));
    };

    fetchSearchItems();
  }, [inputValue]);

  useEffect(() => {
    console.log('Search expanded: ', searchOverlayExpanded);
  }, [searchOverlayExpanded]);

  // Autofocus
  useEffect(() => {
    setTimeout(() => {
      if (autofocus) {
        inputRef?.current?.focus();
      }
    }, 0);
  }, []);

  // Set coordinates of search element
  useEffect(
    () => {
      const rects = searchRef.current.getBoundingClientRect();
      const { height, top, right, bottom, left } = rects;
      const geometry: ISearchBarGeometry = {
        height,
        width: rects.width,
        top,
        right,
        bottom,
        left,
      };

      dispatch(setSearchBarGeometry(geometry));
    },
    // We only need to update rects when width changes
    [width],
  );

  return (
    <div
      ref={searchMeasureRef}
      style={{ zIndex: searchOverlayExpanded && !isMobile ? 20001 : 'auto' }}
      className="relative"
    >
      <div
        ref={searchRef}
        className={classNames(
          'flex items-center w-full justify-between bg-white px-6 rounded-t-lg',
          searchOverlayExpanded && 'rounded-t-lg',
          isMobile && 'border-b border-gray-300',
          isMobile && searchOverlayExpanded ? 'h-20' : 'h-16',
        )}
      >
        <span className="text-secondary">
          <BackSVG
            className={classNames(
              'h-6 w-6 fill-current',
              renderExitButton ? 'block' : 'hidden',
            )}
            onClick={handleExit}
          />
        </span>

        <input
          ref={inputRef}
          spellCheck={false}
          className={classNames(
            renderExitButton ? 'px-6' : 'pl-2 pr-4',
            'flex',
            'flex-grow',
            'border-none',
            'outline-none',
            'text-xl',
            'bg-transparent',
            'w-0',
          )}
          placeholder={'Search'}
          value={inputValue}
          onKeyDown={() => inputRef?.current?.focus()}
          onFocus={handleFocus}
          onChange={handleOnChange}
        />
        <div onClick={() => dispatch(expandSearchOverlay())}>
          <SearchSVG className="h-8" />
        </div>
      </div>
    </div>
  );
}
