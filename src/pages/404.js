// pages/404.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Custom404() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/not-found'); // Redirect to the custom not-found page
    }, [router]);

    return null; // Render nothing as we are redirecting
}
