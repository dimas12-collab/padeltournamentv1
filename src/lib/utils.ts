import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export const dateLabel = (value: string, options?: Intl.DateTimeFormatOptions) => value ? new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Makassar', day:'numeric', month:'short', ...options }).format(new Date(value.length === 10 ? value + 'T12:00:00+08:00' : value)) : 'Unscheduled';
export const timeLabel = (value?: string) => value ? dateLabel(value, {day:undefined,month:undefined,hour:'2-digit',minute:'2-digit',hour12:false}) : 'TBC';
export const titleCase = (s: string) => s.toLowerCase().replaceAll('_',' ').replace(/\b\w/g, c => c.toUpperCase());
