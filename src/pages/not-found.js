// pages/not-found.js

import Head from 'next/head';

export default function NotFoundPage() {
    return (
        <>
            <Head>
                <title>Page Not Found</title>
            </Head>
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h1>404 - Page Not Found</h1>
                <p>The page you are looking for doesn't exist or has been moved.</p>
                <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
                    Go Home
                </a>
            </div>
        </>
    );
}
