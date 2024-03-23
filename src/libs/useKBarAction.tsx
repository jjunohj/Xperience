"use client";

import { Action } from "kbar";
import { useRouter } from "next/navigation";

import ArchiveBoxIcon from "@/src/components/icons/ArchiveBoxIcon";
import HomeIcon from "@/src/components/icons/HomeIcon";
import InBoxIcon from "@/src/components/icons/InBoxIcon";
import InBoxStackIcon from "@/src/components/icons/InBoxStackIcon";
import ContactsIcon from "@/src/components/common/ContactsIcon";
import { siteConfig } from "@/config";

export default function useKBarAction(): Action[] {
  const router = useRouter();

  return [
    {
      id: "home",
      name: "Home",
      shortcut: ["H"],
      keywords: "profile",
      section: "Pages",
      icon: <HomeIcon width={18} />,
      perform: () => router.push("/"),
    },
    {
      id: "blog",
      name: "Blog",
      shortcut: ["B"],
      keywords: "writing words",
      section: "Pages",
      icon: <ArchiveBoxIcon width={18} />,
      perform: () => router.push("/blog"),
    },

    ...(Object.keys(siteConfig.author.contacts)
      .map((sns) => {
        const link =
          siteConfig.author.contacts[
            sns as keyof typeof siteConfig.author.contacts
          ];
        if (!link) return;

        return {
          id: sns,
          name: sns,
          subtitle: link,
          section: "Social",
          icon: <ContactsIcon width={18} contact={sns} />,
          perform: () => {
            window.open(link);
          },
        };
      })
      .filter(Boolean) as Action[]),
  ];
}
