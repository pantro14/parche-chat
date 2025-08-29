'use client';
import { usePathname } from 'next/navigation';
import Header from './header';

function HeaderWrapper() {
  const pathName = usePathname();
  const isPublicPage =
    pathName.includes('/sign-in') || pathName.includes('/sign-up');
  if (isPublicPage) {
    return null;
  } else {
    return <Header />;
  }
}

export default HeaderWrapper;
