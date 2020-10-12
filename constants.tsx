// Ensure SVGs dont have any width or height attrs.
import ChineseSVG from './assets/svgs/cuisines/chinese.svg';
import FrenchSVG from './assets/svgs/cuisines/french.svg';
import IndianSVG from './assets/svgs/cuisines/indian.svg';
import ItalianSVG from './assets/svgs/cuisines/italian.svg';
import JapaneseSVG from './assets/svgs/cuisines/japanese.svg';

export interface ICuisine {
  // Name is the cuisine as it's rendered. Don't forget capitalizations
  name: string;
  href: string;
  svg: JSX.Element;
}

export const CUISINES: Array<ICuisine> = [
  { name: 'Italian', href: '/italian', svg: <ItalianSVG /> },
  { name: 'French', href: '/french', svg: <FrenchSVG /> },
  { name: 'Japanese', href: '/japanese', svg: <JapaneseSVG /> },
  { name: 'Chinese', href: '/chinese', svg: <ChineseSVG /> },
  { name: 'Indian', href: '/indian', svg: <IndianSVG /> },
];

export const UI = {
  MOBILE_BREAKPOINT: 500,
  TABLET_BREAKPOINT: 715,
  DESKTOP_BREAKPOINT: 1100,

  USER_QUERY_404_MAX_LEN: 500,
};

export const SEARCH = {
  // SEARCH_ITEMS_PER_PAGE: 20
  SEARCH_ITEMS_PER_PAGE: 1,
  SOFT_LIMIT_SEARCH_RESULTS_OVERLAY: 4,
};
