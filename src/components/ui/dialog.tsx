'use client';
import * as React from 'react';
import * as Primitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
export const Dialog=Primitive.Root;
export const DialogTrigger=Primitive.Trigger;
export const DialogClose=Primitive.Close;
export const DialogTitle=Primitive.Title;
export const DialogDescription=Primitive.Description;
export function DialogContent({children,className,...props}:React.ComponentProps<typeof Primitive.Content>){return <Primitive.Portal><Primitive.Overlay className="dialog-overlay"/><Primitive.Content className={cn('dialog-content',className)} {...props}>{children}<Primitive.Close className="dialog-close" aria-label="Close dialog"><X size={20}/></Primitive.Close></Primitive.Content></Primitive.Portal>;}
export function DialogHeader({children}:{children:React.ReactNode}){return <div className="dialog-header">{children}</div>;}
export function DialogFooter({children}:{children:React.ReactNode}){return <div className="dialog-footer">{children}</div>;}
