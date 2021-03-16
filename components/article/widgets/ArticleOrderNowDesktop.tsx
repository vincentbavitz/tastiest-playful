import classNames from 'classnames';
import { Contained } from 'components/Contained';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { IState } from 'state/reducers';
import { UI } from '../../../constants';
import { ScreenContext } from '../../../contexts/screen';
import { useAuth } from '../../../hooks/useAuth';
import { useCheckout } from '../../../hooks/useCheckout';
import { IDeal, valdHeads, ValidHead } from '../../../types/cms';
import { Button } from '../../Button';
import { Select } from '../../inputs/Select';

interface Props {
  deal: IDeal;
  slug: string;
}

export function ArticleOrderNowDesktop(props: Props) {
  const { deal, slug: fromSlug } = props;

  const { user } = useAuth();
  const router = useRouter();
  const { isDesktop } = useContext(ScreenContext);
  const { initOrderRequest } = useCheckout();

  // Whether or not we follow scroll or remain in place
  const { articleOfferIsFloating: isFloating } = useSelector(
    (state: IState) => state.navigation,
  );

  const [heads, setHeads] = useState<ValidHead>(1);
  const totalPrice = (Number(heads) * deal?.pricePerHeadGBP).toFixed(2);

  const submit = async () => {
    const orderId = await initOrderRequest(deal.id, heads, fromSlug);
    console.log('ArticleOrderNowDesktop ➡️ orderId:', orderId);

    if (orderId) {
      router.push(`/checkout/?orderId=${orderId}`);
    }
  };

  return (
    <div
      style={{
        marginTop: isFloating
          ? `${UI.ARTICLE.OFFER_WIDGET_FLOAT_GAP_PX}px`
          : 'unset',
      }}
      className={classNames(
        'w-full pointer-events-none',
        isFloating && 'fixed top-0 right-0',
        !isFloating && 'absolute top-0 right-0',
      )}
    >
      <Contained>
        <div className="flex justify-end w-full">
          <div
            style={{
              width: isDesktop
                ? `calc(${UI.ARTICLE.DESKTOP_OFFER_WIDGET_WIDTH_PX}px - 2rem)`
                : '300px',
              maxWidth: isDesktop ? 'unset' : '75vw',
            }}
            className="relative z-30 pt-2 pb-4 mt-20 bg-white border-4 pointer-events-auto desktop:mt-0 border-secondary-1 rounded-xl"
          >
            <h3 className="mb-2 text-xl text-center font-somatic text-primary">
              Get the offer!
            </h3>

            <div className="pb-4 mx-4 overflow-hidden bg-secondary-1 rounded-xl">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={`${deal?.image?.imageUrl}?w=300`}
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col justify-center pt-2 mx-4 space-y-4">
                <p className="text-base leading-none text-center font-somatic">
                  {deal?.tagline}
                </p>

                <div className="py-2 mb-3 text-center border-t-2 border-b-2 border-white border-dashed">
                  <p className="text-base font-somatic text-primary">
                    For £{deal?.pricePerHeadGBP}, you'll get
                  </p>
                </div>

                <div className="text-center">
                  {deal?.includes.map(item => (
                    <div key={item}>{item}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col mx-4 space-y-3">
              <div className="flex items-center justify-between mt-4">
                <span className="font-medium font-roboto bold text-primary">
                  Book for
                </span>
                <div className="w-12">
                  <Select
                    size="small"
                    onChange={value => setHeads(Number(value) as ValidHead)}
                  >
                    {valdHeads.map(n => (
                      <option key={n} className="text-center" value={n}>
                        {n}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="flex justify-between text-xs">
                <span>Booking for {heads} people</span>
                <span>£{totalPrice}</span>
              </div>

              <div className="w-full my-2 border-t border-primary"></div>

              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>£{totalPrice}</span>
              </div>

              <Button
                onClick={submit}
                type="solid"
                size="small"
                className="text-base font-somatic"
              >
                Buy now
              </Button>
            </div>
          </div>
        </div>
      </Contained>
    </div>
  );
}
