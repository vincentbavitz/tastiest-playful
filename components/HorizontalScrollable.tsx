import classNames from 'classnames';
import React, {
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useScroll, useWindowSize } from 'react-use';
import ChevronLeftSecondarySVG from '../../assets/svgs/chevron-left-secondary.svg';
import ChevronRightSecondarySVG from '../../assets/svgs/chevron-right-secondary.svg';
import { UI } from '../constants';
import { ScreenContext } from '../contexts/screen';

interface Props {
  onScroll?: (x: number) => void;
  onItemClick?: () => void;
  children: ReactNode;
}

export function HorizontalScrollable(props: Props) {
  const { onItemClick, children } = props;

  const scrollRef = useRef(null);
  const { x } = useScroll(scrollRef);
  const pageWidth = useWindowSize().width;
  const scrollDistance = pageWidth > 1400 ? 450 : pageWidth / 3;

  const [rightScrollHidden, setRightScrollHidden] = useState(false);

  const { isDesktop, isMobile } = useContext(ScreenContext);

  const handleLeftScroll = () => {
    scrollRef.current.scrollBy({
      left: -scrollDistance,
      behavior: 'smooth',
    });
  };

  const handleRightScroll = () => {
    scrollRef.current.scrollBy({
      left: scrollDistance,
      behavior: 'smooth',
    });
  };

  function handleItemClick() {
    if (onItemClick) {
      onItemClick();
    }
  }

  useEffect(() => {
    const isFullRight =
      scrollRef.current.scrollWidth - scrollRef.current.clientWidth ===
      scrollRef.current.scrollLeft;

    setRightScrollHidden(isFullRight);
  }, [x]);

  return (
    <div className="flex relative w-full mt-20">
      <div
        className={classNames(
          'absolute left-0 flex items-center justify-between h-full w-full',
          !isDesktop && 'hidden',
        )}
      >
        <div
          className={classNames(
            'flex flex-col justify-center h-full z-50 duration-300 -ml-8',
            x <= 1 && 'opacity-0',
          )}
        >
          <ChevronLeftSecondarySVG
            onClick={handleLeftScroll}
            className="h-20 mt-1 cursor-pointer"
          />
        </div>

        <div
          className={classNames(
            'flex flex-col justify-center h-full z-50 duration-300 -mr-8',
            rightScrollHidden && 'opacity-0',
          )}
        >
          <ChevronRightSecondarySVG
            onClick={handleRightScroll}
            className="h-20 mt-1 cursor-pointer"
          />
        </div>
      </div>
      <div
        ref={scrollRef}
        className={classNames(
          'relative',
          'w-full',
          'hide_scroll',
          'scrolling-touch',
          isDesktop ? 'overflow-x-scroll' : 'overflow-x-scroll',
        )}
      >
        <div
          className={classNames('flex overflow-y-visible')}
          style={{
            width: 'fit-content',
            marginLeft: `${isMobile ? UI.PAGE_CONTAINED_PADDING_VW : 0}vw`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
