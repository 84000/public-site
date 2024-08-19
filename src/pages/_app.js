import '../styles/globals.css';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps, header, footer, bodyContent }) {
    return (
        <div>
            <div dangerouslySetInnerHTML={{ __html: header }} />
            <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
            <div dangerouslySetInnerHTML={{ __html: footer }} />
        </div>
    );
}

MyApp.getInitialProps = async ({ ctx }) => {
    const path = ctx.req ? ctx.req.url : '';
    console.log('path', path);

    // Function to handle URL rewriting based on provided rules
    const rewriteURL = (path) => {
        // Match URL patterns and return the rewritten URL
        if (path.match(/^\/translation\/[\w-]+\.[\w-]+$/)) {
            const match = path.match(/^\/translation\/([\w-]+)\.([\w-]+)$/);
            const id = match[1];
            const format = match[2];
            return `https://data-static.vercel.app/translation/${id}/${id}.${format}`;
        } else if (path.match(/^\/translation\/[\w-]+\/[\w-]+$/)) {
            const match = path.match(/^\/translation\/([\w-]+)\/([\w-]+)$/);
            const work = match[1];
            const part = match[2];
            return `https://data-static.vercel.app/translation/${work}/${part}.html`;
        } else if (path.match(/^\/translation\/[\w-]+$/)) {
            const match = path.match(/^\/translation\/([\w-]+)$/);
            const work = match[1];
            return `https://data-static.vercel.app/translation/${work}/index.html`;
        } else if (path.match(/^\/source\/[\w-]+\/folio\/\d+$/)) {
            const match = path.match(/^\/source\/([\w-]+)\/folio\/(\d+)$/);
            const work = match[1];
            const index = match[2];
            return `https://data-static.vercel.app/source/${work}/folio-${index}.html`;
        } else if (path.match(/^\/glossary\/\d+$/)) {
            const match = path.match(/^\/glossary\/(\d+)$/);
            const id = match[1];
            return `https://data-static.vercel.app/glossary/named-entities/entity-${id}.html`;
        } else {
            // Default to fetching from the main Webflow site if none of the patterns match
            return `https://84000.webflow.io${path}`;
        }
    };

    // Rewrite the URL based on the current path
    const rewrittenURL = rewriteURL(path);
    console.log ('rewrittenURL', rewrittenURL);

    // Fetch header, footer, and body content
    const [headerRes, footerRes, bodyRes] = await Promise.all([
        fetch('https://84000.webflow.io/navigation'),
        fetch('https://84000.webflow.io/footer'),
        fetch(rewrittenURL),
    ]);

    const header = await headerRes.text();
    const footer = await footerRes.text();
    const bodyContent = await bodyRes.text();

    return { header, footer, bodyContent };
};

export default MyApp;