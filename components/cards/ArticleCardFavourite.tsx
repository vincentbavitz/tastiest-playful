import classNames from 'classnames';
import router from 'next/dist/client/router';
import Link from 'next/link';
import React, { SyntheticEvent, useContext } from 'react';
import { useMeasure } from 'react-use';
import HeartFilledPrimarySVG from '../../assets/svgs/heart-filled-primary.svg';
import HeartPrimayrSVG from '../../assets/svgs/heart-primary.svg';
import ShareSVG from '../../assets/svgs/share.svg';
import { ScreenContext } from '../../contexts/screen';
import { useArticle } from '../../hooks/article';
import { ISanityArticle } from '../../types/article';
import { generateURL } from '../../utils/routing';

interface Props extends Partial<ISanityArticle> {
  isFavourite: boolean;
}

export function ArticleCardFavourite(props: Props): JSX.Element {
  const { id, featureImage, title, city, slug, cuisine, isFavourite } = props;
  const { isTablet, isDesktop, isHuge } = useContext(ScreenContext);

  const { toggleSaveArticle } = useArticle();
  const [ref, { width }] = useMeasure();
  const isSmall = width < 130;

  const { href, as } = generateURL({ city, slug, cuisine });
  const handleClick = (e: SyntheticEvent) => {
    e.preventDefault();
    router.push(href, as);
  };

  return (
    <div
      ref={ref}
      className={classNames(
        'overflow-hidden w-full bg-opacity-75',
        isSmall ? 'pb-3' : 'pb-1',
      )}
    >
      <div
        onClick={e => handleClick(e)}
        style={{ paddingBottom: '80%' }}
        className={classNames(
          'relative w-full h-0 overflow-hidden bg-primary bg-opacity-10',
          isSmall ? 'rounded-lg' : 'rounded-xl',
        )}
      >
        {featureImage.source && (
          <div className="absolute inset-0 ">
            <img
              className="object-cover w-full h-full"
              src={featureImage?.source}
              alt={featureImage?.altText}
            />
          </div>
        )}
      </div>

      <div className={isSmall ? 'py-1' : 'py-3'}>
        <div
          style={{
            lineHeight: '1em',
            height: '2em',
            paddingBottom: '2.1em',
          }}
          className={classNames(
            !isDesktop ? 'text-base' : isSmall ? 'text-lg' : 'text-twoxl',
            'font-somatic text-primary overflow-hidden cursor-pointer',
          )}
        >
          <Link href={href} as={as}>
            <a>{title}</a>
          </Link>
        </div>

        <div className="flex justify-between text-primary mt-2 pr-2">
          <div
            onClick={() => toggleSaveArticle(id)}
            className="flex items-center cursor-pointer"
          >
            {isFavourite ? (
              <HeartFilledPrimarySVG className={!isDesktop ? 'h-8' : 'h-8'} />
            ) : (
              <HeartPrimayrSVG className={!isDesktop ? 'h-8' : 'h-8'} />
            )}
            {!!isDesktop && isFavourite ? 'Unsave' : 'Save'}
          </div>

          <div className="flex items-center cursor-pointer">
            <ShareSVG className={!isDesktop ? 'h-8' : 'h-8'} />
            {!!isDesktop && 'Share'}
          </div>
        </div>
      </div>
    </div>
  );
}
