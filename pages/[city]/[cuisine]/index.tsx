import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { Footer } from '../../../components/Footer';
import { generateURL } from '../../../utils/routing';
import { titleCase } from '../../../utils/text';

export default function Cuisine() {
  const router = useRouter();

  const { cuisine } = router.query;

  const { href, as } = generateURL({
    cuisine: 'italian',
    city: 'london',
    slug: 'london-italian-spaghetti-bolognese',
  });

  return (
    <>
      <div className="content my-8 px-4">
        <h1 className="text-2xl">This is {titleCase(String(cuisine))}</h1>
      </div>

      <Footer />
    </>
  );
}
