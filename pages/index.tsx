import { CmsApi, IPost } from '@tastiest-io/tastiest-utils';
import { useScreenSize } from 'hooks/useScreenSize';
import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { dlog } from 'utils/development';
import { Contained } from '../components/Contained';
import { HomeFavouritesSection } from '../components/home/HomeFavouritesSection';
import { HomeMapSection } from '../components/home/HomeMapSection';
import { HomeRecentSearchesSection } from '../components/home/HomeRecentSearchesSection';
import { HomeSearchSection } from '../components/home/HomeSearchSection';
import { SuggestDish } from '../components/SuggestDish';
import { METADATA } from '../constants';
import { useAuth } from '../hooks/useAuth';
import { useUserData } from '../hooks/useUserData';

interface Props {
  posts: Array<IPost>;
}

export const getStaticProps: GetStaticProps = async () => {
  const cms = new CmsApi();
  const { posts = [] } = await cms.getPosts(12);

  return {
    props: {
      posts,
    },
    revalidate: 360,
  };
};

const Index: NextPage<Props> = ({ posts = [] }) => {
  const cards = posts ? posts.slice?.(0, 6) : [];

  const { isDesktop } = useScreenSize();

  const { user } = useAuth();
  const { userData } = useUserData(user);

  dlog('index ➡️ user:', user);

  return (
    <>
      <Head>
        <title>{METADATA.TITLE_SUFFIX}</title>
        <meta
          property="og:title"
          content="Tastiest food no matter where you are"
          key="title"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        ></meta>
      </Head>

      <div className="flex flex-col mb-16 space-y-16">
        <Contained>
          <HomeSearchSection />
        </Contained>

        <HomeRecentSearchesSection />
      </div>

      <div className="flex flex-col space-y-16">
        <Contained>
          <HomeMapSection />
        </Contained>

        <HomeFavouritesSection cards={cards} />

        <Contained>
          <SuggestDish />
        </Contained>
      </div>
    </>
  );
};

export default Index;
