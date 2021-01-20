import React, { ReactNode, useContext } from 'react';
import CharacterEatingSVG from '../../../assets/svgs/article/character-eating.svg';
import XiaoDividerSVG from '../../../assets/svgs/article/xiao-divider.svg';
import { UI } from '../../../constants';
import { ScreenContext } from '../../../contexts/screen';
import { ILocation } from '../../../types/article';
import { Contained } from '../../Contained';
import { ArticleFeatureVideoWidget } from '../widgets/ArticleFeatureVideoWidget';
import { ArticleWidgetMap } from '../widgets/ArticleWidgetMap';

interface Props {
  city: string;
  video: string;
  location: ILocation;
  restaurantName: string;
  children?: ReactNode;
}

const EATING_CHARACTER_SIZE_REM = 22;

export function ArticleSectionAbstract(props: Props) {
  const { city, location, video, restaurantName, children } = props;

  const { isDesktop } = useContext(ScreenContext);

  return (
    <Contained backgroundColor="secondary-1">
      {!isDesktop ? <CharacterEatingMobile /> : <CharacterEatingDesktop />}

      <div className="flex flex-col items-center desktop:pt-6 mb-16 space-y-10">
        {children}

        <ArticleWidgetMap
          city={city}
          restaurantName={restaurantName}
          location={location}
        />
        <ArticleFeatureVideoWidget video={video} />
      </div>

      <div className="flex w-full justify-center h-4 mb-12">
        <XiaoDividerSVG className="h-32 -mt-16 desktop:h-56 desktop:-mt-32" />
      </div>
    </Contained>
  );
}

const CharacterEatingDesktop = () => (
  <div
    className="flex justify-center absolute inset-0 z-0"
    style={{ height: 'fit-content', transform: 'translateY(-73%)' }}
  >
    <div
      className="relative flex flex-start"
      style={{
        width: '80vw',
        minWidth: `${
          EATING_CHARACTER_SIZE_REM + 1.5 * UI.ARTICLE.TITLE_MAX_WIDTH_REM
        }rem`,
      }}
    >
      <CharacterEatingSVG
        style={{
          width: `${EATING_CHARACTER_SIZE_REM}rem`,
          height: `${EATING_CHARACTER_SIZE_REM}rem`,
        }}
      />
    </div>
  </div>
);

const CharacterEatingMobile = () => (
  <div
    className="flex justify-center h-0 mb-16 z-0"
    style={{
      marginTop: '10.95rem',
    }}
  >
    <CharacterEatingSVG
      style={{
        width: '15rem',
        height: '15rem',
        transform: 'translateY(-73%)',
      }}
    />
  </div>
);
