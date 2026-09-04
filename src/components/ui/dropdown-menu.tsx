'use client';
import * as React from 'react';
import * as Primitive from '@radix-ui/react-dropdown-menu';
export const DropdownMenu=Primitive.Root;
export const DropdownMenuTrigger=Primitive.Trigger;
export function DropdownMenuContent({children,...props}:React.ComponentProps<typeof Primitive.Content>){return <Primitive.Portal><Primitive.Content className="dropdown-content" sideOffset={5} align="end" {...props}>{children}</Primitive.Content></Primitive.Portal>;}
export function DropdownMenuItem(props:React.ComponentProps<typeof Primitive.Item>){return <Primitive.Item className="dropdown-item" {...props}/>;}
export const DropdownMenuSeparator=Primitive.Separator;
