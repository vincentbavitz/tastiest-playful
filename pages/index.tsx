import groq from 'groq';
import { NextPage } from 'next';
import Head from 'next/head';
import React, { useContext } from 'react';
import client from '../client';
import { ArticleCard } from '../components/ArticleCard';
import { Contained } from '../components/Contained';
import { Footer } from '../components/Footer';
import { HomeFavouritesSection } from '../components/home/HomeFavouritesSection';
import { HomeMapSection } from '../components/home/HomeMapSection';
import { HomeRecentSearchesSection } from '../components/home/HomeRecentSearchesSection';
import { HomeSearchSection } from '../components/home/HomeSearchSection';
import { HomeSuggestDishSection } from '../components/home/HomeSuggestDishSection';
import { METADATA } from '../constants';
import { ScreenContext } from '../contexts/screen';
import { ISanityArticle } from '../types/article';
// import withAuthUser from '../utils/pageWrappers/withAuthUser';
// import withAuthUserInfo from '../utils/pageWrappers/withAuthUserInfo';
import { sanityPostQuery } from '../utils/search';

interface Props {
  posts: Array<ISanityArticle>;
  // AuthUserInfo: any;
}

const Index: NextPage<Props> = ({ posts = [] }) => {
  const cards = posts
    ? posts.slice(0, 4).map(post => <ArticleCard key={post.id} {...post} />)
    : [];

  console.log('posts', posts);

  // const { AuthUserInfo } = props;
  // const authUser = AuthUserInfo.AuthUser;

  // useEffect(() => {
  //   console.log('Auth user', authUser);
  // }, [AuthUserInfo]);

  const { isMobile } = useContext(ScreenContext);

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

      <Contained>
        <div className="flex flex-col space-y-16">
          <HomeSearchSection />
          <HomeRecentSearchesSection />
          <HomeMapSection />
          <HomeFavouritesSection cards={cards} />
          <HomeSuggestDishSection />
        </div>
      </Contained>

      <Footer />
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
    console.log('Posts', posts);
  } catch (error) {
    console.warn('Error:', error);
  }

  return { posts };
};

// export default withAuthUser(withAuthUserInfo(Index));
export default Index;
