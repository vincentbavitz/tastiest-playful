import classNames from 'classnames';
import _ from 'lodash';
import React, { useContext } from 'react';
import { useMeasure } from 'react-use';
import { v4 as uuid } from 'uuid';
import { ScreenContext } from '../../contexts/screen';
import { Contained } from '../Contained';
import { HorizontalScrollable } from '../HorizontalScrollable';

interface Props {
  rows?: number;
  horizontalScroll?: boolean;
  children: JSX.Element[];
}

export function CardGrid({ rows, children, horizontalScroll }: Props) {
  const { isMobile, isDesktop, isHuge } = useContext(ScreenContext);

  const [ref, { width }] = useMeasure();
  const widthOfCardPx = 200;
  const grouping = Math.max(1, Math.min(4, Math.floor(width / widthOfCardPx)));
  const numPaddingCards =
    Math.ceil(children.length / grouping) * grouping - children.length;

  const spacing = isHuge ? 3 : isDesktop ? 6 : 4;
  const spacingY = `space-y-${spacing}`;
  const spacingX = `space-x-${spacing}`;

  const items =
    rows && rows > 0 ? children.slice(0, grouping * rows) : children;

  // Add cards to ensure we fill up each row. Hidden where the row is incomplete
  // to keep even widths
  const cards = [
    ...items,
    ...Array.from(Array(numPaddingCards).keys()).map(i => <div key={i}></div>),
  ];

  return (
    <>
      {isMobile && horizontalScroll ? (
        <div className="">
          <HorizontalScrollable>
            {children.map(child => (
              <div
                key={uuid()}
                style={{
                  width: '80vw',
                  minWidth: '275px',
                  maxWidth: '330px',
                }}
                className="py-4"
              >
                {child}
              </div>
            ))}
          </HorizontalScrollable>
        </div>
      ) : (
        <Contained>
          <div ref={ref} className={classNames('flex flex-col', spacingY)}>
            {_.chunk(cards, grouping).map(group => (
              <div key={uuid()} className={classNames('flex w-full', spacingX)}>
                {group.map(item => (
                  <div key={uuid()} className="flex-1">
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Contained>
      )}
    </>
  );
}
