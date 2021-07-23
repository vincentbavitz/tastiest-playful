import { IPost } from '@tastiest-io/tastiest-utils';
import { ArticleCard } from 'components/cards/ArticleCard';
import { HorizontalScrollable } from 'components/HorizontalScrollable';
import { useScreenSize } from 'hooks/useScreenSize';
import React from 'react';
import { SectionTitle } from '../SectionTitle';

interface Props {
  cards: IPost[];
}

export function HomeFavouritesSection(props: Props) {
  const { isHuge, isDesktop } = useScreenSize();
  const { cards } = props;

  return (
    <div className="flex flex-col space-y-4">
      <SectionTitle>The Tastiest Dishes in London!</SectionTitle>

      <HorizontalScrollable fit={isHuge ? 5 : isDesktop ? 4 : undefined}>
        {cards.map(post => (
          <div
            key={post.id}
            style={{ minWidth: isDesktop ? 'unset' : '200px' }}
          >
            <ArticleCard compact {...post} />
          </div>
        ))}
      </HorizontalScrollable>

      {/* <CardGrid horizontalScroll size="small" rowLimit={2}>
        {cards.map(post => (
          <div
            key={post.id}
            style={{ minWidth: isDesktop ? 'unset' : '200px' }}
          >
            <ArticleCard compact {...post} />
          </div>
        ))}
      </CardGrid> */}
    </div>
  );
}
