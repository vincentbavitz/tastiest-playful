import classNames from 'classnames';
import router from 'next/dist/client/router';
import { SyntheticEvent } from 'react';
import { useMeasure } from 'react-use';
import { ISanityArticle } from '../../types/article';
import { generateURL } from '../../utils/routing';
import { titleCase } from '../../utils/text';
import { OutlineBlock } from '../OutlineBlock';

interface Props {
  post: Partial<ISanityArticle>;
  // Polyfill animates the card with filler content while isLoading
  usePolyfill?: boolean;
  isLoading?: boolean;
}

export function ArticleCard(props: Props): JSX.Element {
  const {
    usePolyfill,
    isLoading,
    post: { featureImage, title, paragraph, /*tags*/ slug, city, cuisine } = {},
  } = props;

  const [ref, { width }] = useMeasure();
  const isSmall = width < 130;

  const handleClick = (e: SyntheticEvent) => {
    const { href, as } = generateURL({ city, slug, cuisine });

    e.preventDefault();
    router.push(href, as);
  };

  const tags = ['crepes', 'sweet'];

  return (
    <div
      ref={ref}
      className={classNames(
        'overflow-hidden w-full bg-secondary bg-opacity-75',
        isSmall ? 'rounded-lg' : 'rounded-xl',
        isSmall ? 'pb-3' : 'pb-1',
      )}
      onClick={e => handleClick(e)}
    >
      <div
        style={{ paddingBottom: '60%' }}
        className="relative w-full h-0 overflow-hidden bg-white bg-opacity-25"
      >
        {featureImage?.source && (
          <div className="absolute inset-0">
            <img
              className="object-cover w-full h-full"
              src={featureImage?.source}
              alt={featureImage?.altText}
            />
          </div>
        )}
      </div>

      <div className={isSmall ? 'px-3' : 'px-4'}>
        <div className={isSmall ? 'py-1' : 'py-3'}>
          <div
            style={{
              lineHeight: '1em',
              height: '2em',
              paddingBottom: '2.1em',
            }}
            className={classNames(
              isSmall ? 'text-base' : 'text-xl',
              'font-somatic overflow-hidden cursor-pointer',
            )}
          >
            {title}
          </div>
          <p className="text-gray-700 text-base">{paragraph}</p>
        </div>

        <div className={classNames('flex space-x-1 mt-1', !isSmall && 'mb-2')}>
          {tags
            .filter(tag => Boolean(tag))
            // Maximum of three tags
            .slice(0, 3)
            .map(tag => (
              <div key={tag.toLowerCase()}>
                {isSmall ? (
                  <span className="text-xs font-medium text-primary hover:underline">
                    {titleCase(tag)}
                  </span>
                ) : (
                  <OutlineBlock size="tiny" theme="alt" bold key={tag}>
                    {titleCase(tag)}
                  </OutlineBlock>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
