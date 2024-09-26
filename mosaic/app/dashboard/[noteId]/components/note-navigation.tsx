// components/NoteNavigation.tsx

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

interface NoteNavigationProps {
  noteId: string;
}

export function NoteNavigation({ noteId }: NoteNavigationProps) {
  const pathname = usePathname();

  const tabs = [
    { name: "Result", href: `/dashboard/${noteId}/result` },
    { name: "Contents", href: `/dashboard/${noteId}/contents` },
  ];

  return (
    <div className="my-2 py-2">
      <NavigationMenu>
        <NavigationMenuList>
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <NavigationMenuItem className="pr-4" key={tab.name}>
                <Link href={tab.href} passHref>
                  <NavigationMenuLink
                    className={`${
                      isActive
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {tab.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
