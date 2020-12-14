import { useRouter } from 'next/router';
import React from 'react';
import HeartPrimarySVG from '../../../assets/svgs/heart-primary.svg';
import ShareSVG from '../../../assets/svgs/share.svg';
import {
  shareToFacebook,
  shareToReddit,
  shareToTwitter,
  shareToWhatsApp,
} from '../../../utils/share';
import { Button } from '../../Button';
import { Dropdown } from '../../Dropdown';
import { DropdownItem } from '../../DropdownItem';
import { Input } from '../../Input';
import { InputGroup } from '../../InputGroup';

interface IShareDropdownItems {
  id: string;
  name: string;
  onClick: () => void;
}

export function ArticleSaveShareWidget() {
  const router = useRouter();
  const articleUrl = `tastiest.io${router.asPath}`;

  const dropdownItems: Array<IShareDropdownItems> = [
    {
      id: 'share-to-facebook',
      name: 'Facebook',
      onClick: () => shareToFacebook(),
    },
    {
      id: 'share-to-twitter',
      name: 'Twitter',
      onClick: () => shareToTwitter(),
    },
    {
      id: 'share-to-whatsapp',
      name: 'WhatsApp',
      onClick: () => shareToWhatsApp(),
    },
    {
      id: 'share-to-reddit',
      name: 'Reddit',
      onClick: () => shareToReddit(),
    },
  ];

  return (
    <div className="flex justify-center w-full">
      <div
        style={{ width: 'fit-content' }}
        className="flex bg-secondary bg-opacity-25 lg:bg-white lg:bg-opacity-75 rounded-md text-primary my-4 lg:my-0"
      >
        <div className="flex flex-1 items-center cursor-pointer px-2 py-1 space-x-1 hover:bg-white">
          <HeartPrimarySVG className="h-8" />
          <span>Save</span>
        </div>

        <div className="flex flex-1 items-center cursor-pointer px-2 py-1 space-x-1 hover:bg-white">
          <ShareSVG className="h-8" />
          <span>Share</span>
        </div>

        <Dropdown isOpen={true} onClickAway={() => null} pull="center">
          <>
            <div className="px-3 pt-1 pb-2">
              <InputGroup className="w-full rounded-sm bg-secondary bg-opacity-25">
                <Input
                  style={{ minWidth: '9rem' }}
                  border="none"
                  readonly
                  value={articleUrl}
                />

                <Button type="text" size="small" color="primary">
                  COPY
                </Button>
              </InputGroup>
            </div>

            {dropdownItems.map(item => (
              <DropdownItem key={item.id} id={item.id}>
                <div className="w-full text-center">{item.name}</div>
              </DropdownItem>
            ))}
          </>
        </Dropdown>
      </div>
    </div>
  );
}
