"use client";

import Link from "next/link";

export function Navigation() {
  return (
    <nav className="bg-primary text-primary-foreground py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          ClearDrops
        </Link>
        <ul className="flex space-x-6">
          <li>
            <Link href="/" className="hover:text-accent">
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/monitor"
              className="hover:text-accent"
            >
              Monitor Water Quality
            </Link>
          </li>
          <li>
            <Link href="/educational" className="hover:text-accent">
              Educational Content
            </Link>
          </li>
          <li>
            <Link href="/notifications" className="hover:text-accent">
              Notifications
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
