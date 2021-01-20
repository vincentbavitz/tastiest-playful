import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { ScreenContext } from '../../contexts/screen';
import { useAuth } from '../../hooks/auth';
import { Avatar } from '../Avatar';
import { Dropdown } from '../Dropdown';
import { DropdownItem } from '../DropdownItem';
import { LoginModal } from '../modals/LoginModal';

interface IProfileDropdownItems {
  id: string;
  name: string;
  isSelected?: boolean;
  onClick: () => void;
}

export function HeaderAvatar() {
  const { isSignedIn, signOut } = useAuth();
  const router = useRouter();

  const { isMobile } = useContext(ScreenContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);

  // Close dropdown on route change
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [router.pathname]);

  // const signedOutDropdownItems: Array<IProfileDropdownItems> = [
  //   {
  //     id: 'sign-in',
  //     name: 'Sign In',
  //     onClick: () => {
  //       setIsDropdownOpen(false);
  //       setLoginModalIsOpen(true);
  //       // router.push('/login', '/login');
  //     },
  //   },
  //   {
  //     id: 'help',
  //     name: 'Help',
  //     onClick: () => {
  //       router.push('/help', '/help');
  //       setIsDropdownOpen(false);
  //     },
  //   },
  // ];

  const signedInDropdownItems: Array<IProfileDropdownItems> = [
    {
      id: 'view-profile',
      name: 'View Profile',
      onClick: () => router.push('/profile', '/profile'),
      isSelected: false,
    },
    {
      id: 'account-info',
      name: 'Account Info',
      onClick: () => router.push('/account', '/account'),
      isSelected: false,
    },
    {
      id: 'sign-out',
      name: 'Sign Out',
      onClick: () => {
        signOut();
        setIsDropdownOpen(false);
      },
    },
  ];

  // const dropdownItems = isSignedIn
  //   ? signedInDropdownItems
  //   : signedOutDropdownItems;

  const dropdownItems = signedInDropdownItems;

  const onAvatarClick = () => {
    if (isSignedIn) {
      setIsDropdownOpen(!isDropdownOpen);
      return;
    }

    setIsDropdownOpen(false);
    setLoginModalIsOpen(true);
  };

  return (
    <div>
      <Avatar onClick={onAvatarClick} />

      <Dropdown
        isOpen={isDropdownOpen}
        style="outline"
        onClickAway={() => setIsDropdownOpen(false)}
        pull="left"
      >
        {dropdownItems.map(item => (
          <DropdownItem
            style="outline"
            key={item.id}
            id={item.id}
            onSelect={item.onClick}
            selected={item.isSelected}
          >
            {item.name}
          </DropdownItem>
        ))}
      </Dropdown>

      <LoginModal
        isOpen={loginModalIsOpen}
        close={() => setLoginModalIsOpen(false)}
      />
    </div>
  );
}
