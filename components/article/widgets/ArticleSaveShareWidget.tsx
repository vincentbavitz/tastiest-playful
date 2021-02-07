import { useRouter } from 'next/router';
import React, { useState } from 'react';
import HeartFilledPrimarySVG from '../../../assets/svgs/heart-filled-primary.svg';
import HeartPrimarySVG from '../../../assets/svgs/heart-primary.svg';
import ShareSVG from '../../../assets/svgs/share.svg';
import { useArticle } from '../../../hooks/useArticle';
import { useAuth } from '../../../hooks/useAuth';
import { useUserData } from '../../../hooks/useUserData';
import {
  shareToFacebook,
  shareToReddit,
  shareToTwitter,
  shareToWhatsApp,
} from '../../../utils/share';
import { Button } from '../../Button';
import { Dropdown } from '../../Dropdown';
import { DropdownItem } from '../../DropdownItem';
import { InputAbstract } from '../../inputs/InputAbstract';
import { InputGroup } from '../../inputs/InputGroup';

interface IShareDropdownItems {
  id: string;
  name: string;
  onClick: () => void;
}

interface Props {
  id: string;
  title: string;
  slug: string;
}

export function ArticleSaveShareWidget(props: Props) {
  const { id, title, slug } = props;

  const { toggleSaveArticle } = useArticle();
  const { user } = useAuth();
  const { userData = {} } = useUserData(user);

  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const articleUrl = `tastiest.io${router.asPath}`;

  const isArticleSaved = userData?.savedArticles?.find(saved => id === saved);

  const dropdownItems: Array<IShareDropdownItems> = [
    {
      id: 'share-to-facebook',
      name: 'Facebook',
      onClick: () => shareToFacebook(title, slug),
    },
    {
      id: 'share-to-twitter',
      name: 'Twitter',
      onClick: () => shareToTwitter(title, slug),
    },
    {
      id: 'share-to-whatsapp',
      name: 'WhatsApp',
      onClick: () => shareToWhatsApp(title, slug),
    },
    {
      id: 'share-to-reddit',
      name: 'Reddit',
      onClick: () => shareToReddit(title, slug),
    },
  ];

  return (
    <div className="z-10 flex justify-center w-full">
      <div
        style={{ width: 'fit-content' }}
        className="flex my-4 rounded-md cursor-pointer bg-soft text-primary"
      >
        <div
          onClick={() => toggleSaveArticle(id)}
          className="flex items-center flex-1 px-2 py-1 space-x-1 font-medium cursor-pointer hover:bg-subtle-2 rounded-l-md"
        >
          {isArticleSaved ? (
            <HeartFilledPrimarySVG className="h-8" />
          ) : (
            <HeartPrimarySVG className="h-8" />
          )}
          <span>Save</span>
        </div>

        <div
          className="flex items-center flex-1 px-2 py-1 space-x-1 font-medium cursor-pointer hover:bg-subtle-2 rounded-r-md"
          onClick={() => setIsDropdownOpen(true)}
        >
          <ShareSVG className="h-8" />
          <span>Share</span>
        </div>

        <Dropdown
          isOpen={isDropdownOpen}
          onClickAway={() => setIsDropdownOpen(false)}
          pull="center"
          offsetX={-50}
          offsetY={25}
        >
          <>
            <div className="px-3 pt-1 pb-2">
              <InputGroup className="w-full bg-opacity-25 rounded-sm bg-secondary">
                <InputAbstract
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
              <DropdownItem key={item.id} id={item.id} onSelect={item.onClick}>
                <div className="w-full text-center">{item.name}</div>
              </DropdownItem>
            ))}
          </>
        </Dropdown>
      </div>
    </div>
  );
}
