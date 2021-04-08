import SuggestDishDesktopSVG from '@svg/illustrations/suggest-dish-desktop.svg';
import SuggestDishMobileSVG from '@svg/illustrations/suggest-dish-mobile.svg';
import { Button, Input } from '@tastiest-io/tastiest-components';
import clsx from 'clsx';
import { useAuth } from 'hooks/useAuth';
import { useScreenSize } from 'hooks/useScreenSize';
import { useUserData } from 'hooks/useUserData';
import React, { useState } from 'react';
import { Contained } from './Contained';

export function SuggestDish() {
  const { user, isSignedIn } = useAuth();
  const { userData } = useUserData(user);
  const { isMobile, isDesktop, isHuge } = useScreenSize();

  // Form values
  const [email, setEmail] = useState(userData?.details?.email ?? '');
  const [restaurantLocation, setRestaurantLocation] = useState('');
  const [dishName, setDishName] = useState('');
  const [cuisine, setCuisine] = useState('');

  // prettier-ignore
  const svgMarginLeft = isHuge ?
    isSignedIn ? '7rem' : '10rem' :
    isSignedIn ? '10rem' : '6rem';

  return (
    <Contained>
      <div
        className={clsx(
          'relative flex w-full justify-start',
          isDesktop && !isHuge && 'space-x-10',
        )}
      >
        {isDesktop && (
          <div
            className="relative"
            style={{
              width: '30rem',
              marginLeft: isHuge ? '0' : '-22vw',
            }}
          >
            <SuggestDishDesktopSVG
              style={{
                height: isSignedIn ? '16rem' : '22rem',
                marginTop: isSignedIn ? '0' : '2.5rem',
                marginLeft: svgMarginLeft,
              }}
            />
          </div>
        )}

        <div
          style={{
            minWidth: '20rem',
            maxWidth: isDesktop ? '25rem' : 'unset',
            marginTop: isSignedIn ? '0' : '1rem',
          }}
          className={clsx('relative flex-1 tablet:mb-1')}
        >
          {isDesktop ? (
            <div
              style={{ width: '8.1rem', marginLeft: 'calc(-9rem - 3vw)' }}
              className={clsx(
                'flex justify-end absolute left-0 leading-tight text-primary font-somatic',
                isSignedIn ? 'text-3xl' : 'text-4xl',
              )}
            >
              <div>Suggest a dish</div>
            </div>
          ) : (
            <div className="flex justify-center mb-6 text-4xl text-primary font-somatic">
              Suggest a dish
            </div>
          )}

          <div className="flex flex-col mt-0 space-y-4 tablet:mt-6">
            <Input
              value={restaurantLocation}
              onValueChange={setRestaurantLocation}
              label="Location of restaurant"
              labelTheme="primary"
              maxLength={120}
            />

            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  value={dishName}
                  onValueChange={setDishName}
                  label="Dish name"
                  labelTheme="primary"
                  maxLength={50}
                />
              </div>

              <div className="flex-1">
                <Input
                  value={cuisine}
                  onValueChange={setCuisine}
                  label="Cuisine"
                  labelTheme="primary"
                  maxLength={20}
                />
              </div>
            </div>

            {!isSignedIn && (
              <Input
                value={email}
                onValueChange={setEmail}
                label="Email Address"
                labelTheme="primary"
                maxLength={50}
              />
            )}

            <Button wide={isMobile} className="tracking-widest">
              Send
            </Button>
          </div>

          {!isDesktop && (
            <div className="flex justify-center flex-grow mt-6">
              <SuggestDishMobileSVG className="w-3/4 h-full md:w-full" />
            </div>
          )}
        </div>
      </div>
    </Contained>
  );
}
