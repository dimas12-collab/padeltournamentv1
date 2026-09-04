import Link from 'next/link';
export default function NotFound() { return <main className="page empty"><span className="eyebrow">404 · OUT OF COURT</span><h1>We couldn’t find that page.</h1><p>The event or match may no longer be available.</p><Link className="btn" href="/">Back to events</Link></main>; }
