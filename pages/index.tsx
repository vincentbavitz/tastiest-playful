import groq from 'groq';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import client from '../client';
import { ArticleItem } from '../components/ArticleItem';
import { CuisineBar } from '../components/CuisineBar';
import { Footer } from '../components/Footer';
import MainPageSearch from '../components/MainPageSearch';
import NavBar from '../components/NavBar';
import { ISanityArticle } from '../types/article';
import { generateURL } from '../utils/routing';
import { sanityPostQuery } from '../utils/search';

interface Props {
  posts: Array<ISanityArticle>;
}

const Index = (props: Props) => {
  const { posts = [] } = props;
  const cards = posts
    ? posts.map(post => <ArticleItem key={post.id} {...post} />)
    : [];

  return (
    <>
      <Head>
        <title>Tastiest</title>
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

      <div>
        <NavBar />
        <CuisineBar />
        <MainPageSearch />
        <div className="md:flex overflow-x-hidden m-6">{cards}</div>
      </div>
      <div>
        <h1>Sanity output below</h1>
        <ul>
          {posts?.length &&
            posts
              .filter(post => post.slug && post.cuisine && post.city)
              .map(post => {
                const { href, as } = generateURL({
                  city: post.city,
                  cuisine: post.cuisine,
                  slug: post?.slug,
                });

                return (
                  <div key={post.id}>
                    <button className="m-1 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
                      <Link href={href} as={as}>
                        <a>{post.title}</a>
                      </Link>
                    </button>
                    ({new Date(post.updatedAt).toDateString()})
                  </div>
                );
              })}
        </ul>
      </div>
      <Footer />
    </>
  );
};

export const getStaticProps = async () => {
  const query = groq`
    *[_type == "post"]|order(publishedAt desc) {
      ${sanityPostQuery}
    }
  `;

  let posts: ISanityArticle;
  try {
    posts = await client.fetch(query);
    console.log('Posts', posts);
  } catch (error) {
    console.warn('Error:', error);
  }

  return {
    props: {
      posts,
    },
  };
};

export default Index;
