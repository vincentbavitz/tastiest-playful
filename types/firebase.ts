import { ILocation } from './cms';
import { CuisineSymbol } from './cuisine';
import { IDateObject } from './various';

export enum UserData {
  DISPLAY_NAME = 'displayName',
  BOOKINGS = 'bookings',
  COVERS = 'covers',
  RECENT_SEARCHES = 'recentSearches',
  PROFILE_PICTURE_URL = 'profilePictureUrl',
  REFERRED_FROM = 'referredFrom',

  RESTAURANTS_VISITED = 'restaurantsVisited',
  SAVED_ARTICLES = 'savedArticles',
  PREFERENCES = 'preferences',

  USER_SESSIONS = 'userSessions',
  USER_DEVICE = 'userDevice',
}

export interface IUserSession {
  device: 'mobile' | 'tablet' | 'desktop';
  sessionStartTimestamp: number;
  sessionEndTimestamp: number;
}

export interface IBooking {
  never;
}

export interface ICover {
  never;
}

export interface IRecentSearch {
  query: string;
  timestamp: number;
}

export type TFavouriteCuisine = {
  existing: CuisineSymbol | 'ALL_FOOD' | null;
  other: string | null;
};

export interface IUserPreferences {
  // Lookup latitude and longitude using Mapbox API to search by location
  // with contentful
  address: ILocation | null;
  // In order of decreasing proference. Max of three.
  favouriteCuisines:
    | [TFavouriteCuisine?, TFavouriteCuisine?, TFavouriteCuisine?]
    | null;
  birthday: IDateObject | null;
}

// prettier-ignore
export type TUserData<T extends UserData> =
    // User profile
    T extends UserData.DISPLAY_NAME ? string :
    T extends UserData.PROFILE_PICTURE_URL ? string :
    T extends UserData.REFERRED_FROM ? string :

    // User actions
    T extends UserData.RECENT_SEARCHES ? Array<IRecentSearch> :

    // User favourites
    T extends UserData.SAVED_ARTICLES ? Array<string> :

    // User metadata
    T extends UserData.USER_SESSIONS ? Array<IUserSession> :
        
    // User preferences
    T extends UserData.PREFERENCES ? IUserPreferences :

    // User orders
    T extends UserData.BOOKINGS ? Array<IBooking> :
    T extends UserData.COVERS ? Array<ICover> : 
    T extends UserData.RESTAURANTS_VISITED ? Array<string> :

    never;

export type IUserData = {
  [key in UserData]: TUserData<key>;
};
