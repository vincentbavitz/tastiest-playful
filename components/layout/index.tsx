import React, { ReactNode } from 'react';
import { CuisineBar } from '../cuisine/CuisineBar';
import { Footer } from '../Footer';
import { Header } from '../header/Header';
import { LoginModal } from '../modals/LoginModal';
import { AcceptTrackingPopup } from '../popups/AcceptTrackingPopup';
import { SearchOverlay } from '../search/SearchOverlay';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <LoginModal />

      <div
        style={{ height: '100vh' }}
        className="flex flex-col justify-between"
      >
        <div className="relative flex-grow">
          <SearchOverlay />
          <Header />
          <CuisineBar />

          <div className="flex-grow">{children}</div>
        </div>

        <div>
          <Footer />
        </div>
      </div>

      <AcceptTrackingPopup />
    </>
  );
}
