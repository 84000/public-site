import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleLinkClick = (event) => {
      const anchor = event.target.closest('a');
      if (anchor) {
        const urlObj = new URL(anchor.href);
        const path = urlObj.pathname;
        const part = urlObj.searchParams.get('part');
        const hash = urlObj.hash.substring(1);

        if (path.startsWith('/translation') && part && hash) {
          event.preventDefault(); // Prevent the default link behavior
          const newPath = `${path.replace('.html', '')}/${part}${urlObj.hash}`;
          router.push(newPath, undefined, { shallow: true });
        }
      }
    };

    // Attach the click event listener to capture link clicks
    document.addEventListener('click', handleLinkClick);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;
