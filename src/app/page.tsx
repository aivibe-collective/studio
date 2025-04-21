'use client';

import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {Button} from '@/components/ui/button';
import {Icons} from '@/components/icons';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import Link from 'next/link';

const navigation = [
  {
    title: 'Dashboard',
    href: '/',
    icon: <Icons.home className="h-4 w-4"/>,
  },
  {
    title: 'Content Planning',
    href: '/content-planning',
    icon: <Icons.workflow className="h-4 w-4"/>,
  },
  {
    title: 'Component Generation',
    href: '/component-generation',
    icon: <Icons.plusCircle className="h-4 w-4"/>,
  },
  {
    title: 'Quality Assurance',
    href: '/quality-assurance',
    icon: <Icons.shield className="h-4 w-4"/>,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: <Icons.settings className="h-4 w-4"/>,
  },
];

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar collapsible="icon">
          <SidebarHeader className="h-14">
            <h1 className="text-lg font-semibold">Content Alchemist</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <SidebarSeparator/>
            <SidebarGroup>
              <SidebarGroupLabel>Team</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Icons.user className="h-4 w-4"/>
                    <span>Profile</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <Button variant="ghost" size="icon">
              <Icons.mail className="h-4 w-4"/>
            </Button>
            <Button variant="ghost" size="icon">
              <Icons.settings className="h-4 w-4"/>
            </Button>
            <SidebarTrigger className="ml-auto"/>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 p-4">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>Overview of your content creation workflow.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add dashboard content here */}
              <p>Welcome to Content Alchemist!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
}

function SidebarGroupLabel({children}: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-2 text-sm font-medium text-muted-foreground">
      {children}
    </div>
  );
}
