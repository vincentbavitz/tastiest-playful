import groq from 'groq';
import { NextPage } from 'next';
import Head from 'next/head';
import React, { useContext } from 'react';
import client from '../client';
import { ArticleCard } from '../components/cards/ArticleCard';
import { Contained } from '../components/Contained';
import { HomeFavouritesSection } from '../components/home/HomeFavouritesSection';
import { HomeMapSection } from '../components/home/HomeMapSection';
import { HomeRecentSearchesSection } from '../components/home/HomeRecentSearchesSection';
import { HomeSearchSection } from '../components/home/HomeSearchSection';
import { SuggestDish } from '../components/SuggestDish';
import { METADATA } from '../constants';
import { ScreenContext } from '../contexts/screen';
// import withAuthUser from '../utils/pageWrappers/withAuthUser';
// import withAuthUserInfo from '../utils/pageWrappers/withAuthUserInfo';
import { sanityPostQuery } from '../hooks/search';
import { useUserData } from '../hooks/userData';
import { ISanityArticle } from '../types/article';

interface Props {
  posts: Array<ISanityArticle>;
  // AuthUserInfo: any;
}

const Index: NextPage<Props> = ({ posts = [] }) => {
  const cards = posts
    ? posts.slice(0, 4).map(post => <ArticleCard key={post.id} {...post} />)
    : [];

  const { isDesktop } = useContext(ScreenContext);

  const { userData } = useUserData();
  console.log('userData', userData);

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

      <div className="flex flex-col space-y-16 mb-16">
        <Contained>
          <HomeSearchSection />
        </Contained>

        <HomeRecentSearchesSection />
      </div>

      <Contained>
        <div className="flex flex-col space-y-16">
          <HomeMapSection />
          <HomeFavouritesSection cards={cards} />
          <SuggestDish />
        </div>
      </Contained>
    </>
  );
};

Index.getInitialProps = async () => {
  const query = groq`
    *[_type == "post"]|order(publishedAt desc) {
      ${sanityPostQuery}
    }
  `;

  let posts: Array<ISanityArticle>;
  try {
    posts = await client.fetch(query);
  } catch (error) {
    console.warn('Error:', error);
  }

  return { posts };
};

// export default withAuthUser(withAuthUserInfo(Index));
export default Index;
