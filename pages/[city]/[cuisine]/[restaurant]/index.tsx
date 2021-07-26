import { CmsApi, dlog, IRestaurant } from '@tastiest-io/tastiest-utils';
import { ArticleFeatureVideoWidget } from 'components/article/widgets/ArticleFeatureVideoWidget';
import { ArticleCard } from 'components/cards/ArticleCard';
import { CardGrid } from 'components/cards/CardGrid';
import { Contained } from 'components/Contained';
import { LocationIndictor } from 'components/LocationIndictor';
import { RestaurantMapModal } from 'components/modals/RestaurantMapModal';
import { RichBody } from 'components/RichBody';
import { SectionTitle } from 'components/SectionTitle';
import { useScreenSize } from 'hooks/useScreenSize';
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next';
import Head from 'next/head';
import { ParsedUrlQuery } from 'querystring';
import React, { useState } from 'react';
import { getGoogleMapLink } from 'utils/location';
import { generateTitle } from 'utils/metadata';

interface IPath {
  params: {
    city: string;
    cuisine: string;
    restaurant: string;
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const cms = new CmsApi();

  let page = 1;
  let foundAllRestaurants = false;
  const restaurants: IRestaurant[] = [];

  // Contentful only allows 100 at a time
  while (!foundAllRestaurants) {
    const { restaurants: _restaurants } = await cms.getRestaurants(100, page);

    if (_restaurants.length === 0) {
      foundAllRestaurants = true;
      continue;
    }

    restaurants.push(..._restaurants);
    page++;
  }

  const paths: IPath[] = restaurants.map(restaurant => ({
    params: {
      city: restaurant.city.toLowerCase(),
      cuisine: restaurant.cuisines[0].toLowerCase(),
      restaurant: restaurant.uriName.toLowerCase(),
    },
  }));

  // Blocking ensures that if the path isn't cached,
  // we build it before serving.
  return { paths, fallback: 'blocking' };
};

export const getStaticProps = async (
  context: GetStaticPropsContext<ParsedUrlQuery>,
) => {
  const cms = new CmsApi();

  const restaurantUriName = context.params?.restaurant;
  const restaurant = await cms.getRestaurantFromUriName(
    String(restaurantUriName),
  );

  dlog('index ➡️ restaurant:', restaurant);

  if (!restaurant) {
    return {
      props: { restaurant: null as IRestaurant },
      notFound: true,
    };
  }

  // Get posts from restaurant
  const { posts } = await cms.getPostsOfRestaurant(restaurant.uriName, 100);

  // Get the restaurant's Tastiest Dishes
  const { dishes: tastiestDishes } = await cms.getTastiestDishesOfRestaurant(
    restaurant.uriName,
  );

  return {
    props: { restaurant, tastiestDishes, posts },
    revalidate: 360,
  };
};

const RestaurantPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const { restaurant, tastiestDishes, posts } = props;
  dlog('index ➡️ restaurant:', restaurant);

  const { isMobile, isTablet, isDesktop, isHuge } = useScreenSize();

  // As a percentage
  // prettier-ignore
  const heroIllustrationSizeRem = 
    isHuge ? 80 :
    isTablet ? 60 :
    isMobile ? 40 :
    70;

  const [mapModalOpen, setMapModalOpen] = useState(false);

  return (
    <div>
      <Head>
        <title>{generateTitle(restaurant.name)}</title>
      </Head>
      <div className="relative w-full">
        <div className="absolute z-10 w-full top-4 mobile:top-8 tablet:top-12 desktop:top-16 leading-0">
          <h1 className="text-3xl text-center text-primary font-somatic">
            {restaurant.name}
          </h1>
        </div>

        <div
          className="flex justify-center pt-3 mobile:pt-0"
          style={{ width: '200%', transform: `translateX(-25%)` }}
        >
          <div
            style={{
              width: `${heroIllustrationSizeRem}rem`,
            }}
          >
            <img src={restaurant.heroIllustration.url} className="h-full" />
          </div>
        </div>
      </div>

      <Contained maxWidth={900}>
        <div className="flex w-full">
          <div className="flex flex-col space-y-6">
            <ArticleFeatureVideoWidget video={restaurant.video} />

            <div>
              <RichBody body={restaurant.description}></RichBody>
            </div>
          </div>

          <div className="flex flex-col pl-8 space-y-2">
            <h3
              style={{ minWidth: '10rem' }}
              className="text-3xl text-primary font-somatic whitespace-nowrap"
            >
              {restaurant?.name}
            </h3>

            {restaurant.location.displayLocation && (
              <div className="">
                <LocationIndictor
                  location={restaurant.location.displayLocation}
                />
              </div>
            )}

            <div className="leading-tight">
              <a
                target="_blank"
                rel="noreferrer"
                href={getGoogleMapLink(
                  restaurant.location.lat,
                  restaurant.location.lon,
                )}
              >
                {restaurant?.location?.address}
              </a>

              <div className="pt-1">
                <span
                  onClick={() => setMapModalOpen(true)}
                  className="font-medium underline cursor-pointer text-primary"
                >
                  View Map
                </span>
              </div>
            </div>

            <div className="pt-6">
              <p className="mb-1 font-medium border-b border-opacity-10 border-alt-1">
                Opening Times
              </p>
              <div className="text-sm leading-5 text-left">
                <RichBody
                  paragraph={{ justify: false, margins: false }}
                  body={restaurant.tradingHoursText}
                ></RichBody>
              </div>
            </div>

            <div className="flex flex-col pt-6 space-y-4">
              {tastiestDishes?.map(dish => (
                <div key={dish.id}>{dish.name}</div>
              ))}
            </div>
          </div>
        </div>
      </Contained>

      <div className="pb-64"></div>

      <RestaurantMapModal
        restaurant={restaurant}
        isOpen={mapModalOpen}
        close={() => setMapModalOpen(false)}
      />

      <div className="py-12">
        <SectionTitle>
          <>Exclusive Tastiest Offers</>
        </SectionTitle>

        <div className="mt-6">
          <CardGrid size="large">
            {posts.map(post => (
              <ArticleCard key={post.id} {...post} compact />
            ))}
          </CardGrid>
        </div>
      </div>
    </div>
  );
};

export default RestaurantPage;
