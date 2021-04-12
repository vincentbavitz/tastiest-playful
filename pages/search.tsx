import { CMS, CmsApi, dlog, IPost } from '@tastiest-io/tastiest-utils';
import RecommendedPosts from 'components/sections/RecommendedPosts';
import { SuggestRestaurant } from 'components/SuggestRestaurant';
import { useScreenSize } from 'hooks/useScreenSize';
import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { SearchHeroDesktop, SearchHeroMobile } from 'public/assets/page';
import React from 'react';
import ReactPaginate from 'react-paginate';
import { ArticleCardRow } from '../components/cards/ArticleCardRow';
import { Contained } from '../components/Contained';
import { METADATA, SEARCH } from '../constants';

interface Props {
  posts: IPost[];
  totalCount: number;
  currentPage: number;

  // Display at the bottom; 'You might also like'...
  topPosts: IPost[];
}

// Search client side to keep page load times down.
export const getServerSideProps = async ({ query }) => {
  const cms = new CmsApi();
  const page = Number(query.page ?? 1);
  const { s: encodedSearchQuery } = query;
  const searchQuery = decodeURI(String(encodedSearchQuery));

  const { posts = [], total: totalCount = 0 } = await cms.searchPosts(
    searchQuery,
    CMS.BLOG_RESULTS_PER_PAGE,
    page,
  );

  const { posts: topPosts } = await cms.getTopPosts(8);

  const props: Props = {
    posts,
    totalCount,
    currentPage: page,
    topPosts,
  };

  return {
    props,
  };
};

const Search = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const { posts, topPosts, totalCount, currentPage } = props;

  const router = useRouter();
  const { isDesktop } = useScreenSize();

  // Show these options if the user is on this page without entering a query
  const recommendedOptions = <></>;

  const paginationHandler = page => {
    const currentPath = router.pathname;

    // Copy current query to avoid its removing
    const currentQuery = { ...router.query };
    currentQuery.page = page.selected + 1;

    router.push({
      pathname: currentPath,
      query: currentQuery,
    });
  };

  //
  // USING QUERY          ?s=
  // OR USING CITY        ?city=
  // OR USING CUISINE`    ?cuisine=
  // OR USING CATEGORY?   ?tags=,,
  // OR USING DISH/       ?dish=
  //

  const pageCount = Math.ceil(props.totalCount / SEARCH.SEARCH_ITEMS_PER_PAGE);
  const showPagination = posts.length > 0 && pageCount > 1;

  dlog('search ➡️ pageCount:', pageCount);
  dlog('search ➡️ props.totalCount:', props.totalCount);

  return (
    <div>
      <title>{METADATA.TITLE_SUFFIX}</title>

      <div className="relative w-full mt-6 mb-12">
        {!isDesktop ? (
          <>
            <SearchHeroMobile
              style={{
                width: '150%',
                transform: 'translateX(-18%)',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-2xl text-thin font-somatic text-primary">
                {posts.length > 0 ? 'Search Results' : 'Nothing Found'}
              </h1>
            </div>
          </>
        ) : (
          <Contained>
            <SearchHeroDesktop className="w-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-2xl font-somatic text-primary">
                {posts.length > 0 ? 'Search Results' : 'Nothing Found'}
              </h1>
            </div>
          </Contained>
        )}
      </div>

      <Contained>
        <div className="flex flex-col space-y-8">
          {posts.map(post => (
            <ArticleCardRow key={post.slug} {...post} />
          ))}
        </div>

        {showPagination && (
          <div className="mt-8 mobile:mt-12">
            <ReactPaginate
              previousLabel={'<'}
              nextLabel={'>'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              activeClassName={'active'}
              containerClassName={'pagination'}
              subContainerClassName={''}
              initialPage={props.currentPage - 1}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={paginationHandler}
            />
          </div>
        )}
      </Contained>

      <div className="pt-20 mb-12">
        <RecommendedPosts
          label="Didn't find what you were looking for?"
          posts={topPosts}
        ></RecommendedPosts>
      </div>

      <SuggestRestaurant />
    </div>
  );
};

export default Search;
