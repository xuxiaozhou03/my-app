"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      name: "仪表盘",
      href: "/",
    },
    {
      name: "数据源",
      href: "/data-sources",
    },
    {
      name: "策略",
      href: "/strategies",
    },
    {
      name: "策略开发",
      href: "/strategy-development",
    },
    {
      name: "回测",
      href: "/backtesting",
    },
    {
      name: "投资组合",
      href: "/portfolio",
    },
    {
      name: "报告",
      href: "/reports",
    },
  ]

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href ? "text-primary" : "text-muted-foreground",
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  )
}
