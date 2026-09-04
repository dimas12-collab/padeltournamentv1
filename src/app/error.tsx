'use client';
export default function ErrorPage({reset}:{reset:()=>void}) { return <main className="page empty"><h1>Something went wrong</h1><p>Your browser data is still here. Please try again.</p><button className="btn" onClick={reset}>Try again</button></main>; }
