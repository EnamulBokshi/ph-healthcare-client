interface StatsCardProps{
    title: string;
    value: string | number;
    iconName: string;
    description?: string;
    className?: string;
}



import React, { createElement } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { getIconComponent } from '@/lib/iconMapper';
import { cn } from '@/lib/utils';

export default function StatsCard({ title, value, iconName, description, className }: StatsCardProps) {
  return (
   <Card className={cn("hover:shadow-md transition-shadow", className)}>
    <CardHeader className={"flex items-center justify-between space-y-0 pb-2"}>
        <CardTitle className={"text-sm font-medium"}>
            {title}
        </CardTitle>
        <div className={'h-9  w-9 rounded-lg bg-primary text-primary-foreground flex items-center'}>
            {
                createElement(getIconComponent(iconName), {className: "w-6 h-6"})
            }
        </div>
    </CardHeader>
    <CardContent className='space-y-1'>
        <div className="text-2xl font-semibold">
            {value}
        </div>
        {
            description && (
                <p className="text-sm text-muted-foreground mt-1">
                    {description}
                </p>
            )
        }
    </CardContent>
   </Card>
  )
}
