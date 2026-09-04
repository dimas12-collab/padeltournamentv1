'use client';
import { Suspense,useEffect } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useTournament } from '@/lib/store';
import { Home } from './home';
import { PublicEvent } from './public-event';
import { Missing } from './shared';
import Loading from '@/app/loading';
import { useWebMcp } from '@/hooks/use-webmcp';
const Admin=dynamic(()=>import('./admin').then(m=>m.Admin),{loading:Loading});
const Login=dynamic(()=>import('./admin').then(m=>m.Login),{loading:Loading});
export function TournamentApp(){return <Suspense fallback={<Loading/>}><App/></Suspense>;}
function App(){const path=usePathname();const {data,hydrate,refresh,hydrated,storageError,dismissStorageError}=useTournament();useEffect(()=>{void hydrate();},[hydrate]);useEffect(()=>{if(hydrated)void refresh().catch(()=>undefined);},[path,hydrated,refresh]);useWebMcp(data);const parts=path.split('/').filter(Boolean);return <>{storageError&&<div className="storage-warning" role="alert">{storageError}<button onClick={dismissStorageError} aria-label="Dismiss storage message">×</button></div>}{!hydrated?<Loading/>:parts[0]==='admin'?<Admin key={path} parts={parts}/>:parts[0]==='login'?<Login/>:parts[0]==='e'?<PublicEvent key={path} parts={parts} data={data}/>:parts.length===0?<Home data={{...data,events:data.events.filter(e=>!e.deletedAt)}}/>:<Missing/>}</>;}
