"use client"

import { navLinks } from '@/constants'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'
import { useState } from 'react'
import ThemeButton from '@/components/ThemeButton'

const editLinks = navLinks.filter(link => [
  '/transformations/add/restore',
  '/transformations/add/fill',
  '/transformations/add/remove',
  '/transformations/add/recolor',
  '/transformations/add/removeBackground',
].includes(link.route));

const otherLinks = navLinks.filter(link => ![
  '/transformations/add/restore',
  '/transformations/add/fill',
  '/transformations/add/remove',
  '/transformations/add/recolor',
  '/transformations/add/removeBackground',
].includes(link.route));

const Navbar = () => {
  const pathname = usePathname();
  const [editOpen, setEditOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <nav className="glass-navbar w-full max-w-6xl mx-auto flex items-center justify-between px-6 py-1 fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-2xl border border-white/20 overflow-visible mb-8 shadow-[0_8px_40px_0_rgba(59,130,246,0.35)]">
      {/* Néons */}
      <span className="glass-navbar-neon left"></span>
      <span className="glass-navbar-neon right"></span>
      <span className="glass-navbar-neon bottom"></span>
      {/* Logo à gauche */}
      <Link href="/" className="flex items-center gap-2 z-10 mr-8">
        <Image src="/assets/images/brr.png" alt="logo" width={48} height={48} />
      </Link>
      {/* Liens au centre */}
      <div className="flex gap-4 items-center z-10 flex-1 justify-center">
        {/* Home sans icône */}
        <Link
          href="/"
          className={`px-3 py-2 rounded-full transition-all text-sm font-medium ${pathname === '/' ? 'bg-purple-gradient text-white' : 'text-gray-200 hover:bg-blue-100 hover:shadow-[0_2px_8px_0_rgba(59,130,246,0.15)]'}`}
        >
          Home
        </Link>
        {/* Edit dropdown */}
        <div className="relative">
          <button
            className="flex items-center px-3 py-2 rounded-full transition-all text-sm font-medium text-gray-200 hover:bg-blue-100 hover:shadow-[0_2px_8px_0_rgba(59,130,246,0.15)]"
            onClick={() => setEditOpen((v) => !v)}
            type="button"
            style={{backdropFilter: 'blur(2px)'}}
          >
            <span>Edit Image</span>
          </button>
          {editOpen && (
            <ul className="absolute left-0 mt-2 w-56 border rounded-lg shadow-lg z-50 edit-dropdown-list bg-white border-gray-600 dark:bg-black">
              {editLinks.map((link) => {
                const isActive = link.route === pathname;
                return (
                  <li key={link.route}>
                    <Link
                      href={link.route}
                      className={`flex items-center gap-2 px-4 py-2 w-full text-left text-sm font-medium rounded-lg transition-all
                        ${isActive ? 'bg-purple-gradient text-white' : 'text-gray-900 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-900'}
                      `}
                      onClick={() => setEditOpen(false)}
                    >
                      <Image src={link.icon} alt={link.label} width={20} height={20} />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {/* Image Generator et Video Generator côte à côte */}
        <div className="flex gap-2 items-center">
          <Link
            href="/image-generator"
            className={`px-3 py-2 rounded-full transition-all text-sm font-medium ${pathname === '/image-generator' ? 'bg-purple-gradient text-white' : 'text-gray-200 hover:bg-blue-100 hover:shadow-[0_2px_8px_0_rgba(59,130,246,0.15)]'}`}
          >
            Image Generator
          </Link>
          {/* Video Generator Dropdown */}
          <div className="relative">
            <button
              className="flex items-center px-3 py-2 rounded-full transition-all text-sm font-medium text-gray-200 hover:bg-blue-100 hover:shadow-[0_2px_8px_0_rgba(59,130,246,0.15)]"
              onClick={() => setVideoOpen((v) => !v)}
              type="button"
              style={{backdropFilter: 'blur(2px)'}}
            >
              <span>Video Generator</span>
            </button>
            {videoOpen && (
              <ul className="absolute left-0 mt-2 w-56 border rounded-lg shadow-lg z-50 edit-dropdown-list bg-white border-gray-600 dark:bg-black">
                <li>
                  <Link
                    href="/dashboard/create-new"
                    className={`flex items-center gap-2 px-4 py-2 w-full text-left text-sm font-medium rounded-lg transition-all
                      ${pathname === '/video-generator' ? 'bg-purple-gradient text-white' : 'text-gray-900 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-900'}
                    `}
                    onClick={() => setVideoOpen(false)}
                  >
                    Create Video
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-2 px-4 py-2 w-full text-left text-sm font-medium rounded-lg transition-all
                      ${pathname === '/dashboard' ? 'bg-purple-gradient text-white' : 'text-gray-900 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-900'}
                    `}
                    onClick={() => setVideoOpen(false)}
                  >
                    View Videos
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
        {/* Autres liens (sauf Home et Image Generator) */}
        {otherLinks.filter(link => link.route !== '/' && link.route !== '/image-generator' && link.route !== '/profile' && link.route !== '/credits').map((link) => {
          const isActive = link.route === pathname;
          return (
            <Link
              key={link.route}
              href={link.route}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all text-sm font-medium ${
                isActive ? 'bg-purple-gradient text-white' : 'text-gray-200 hover:bg-white/10'
              }`}
            >
              <Image src={link.icon} alt={link.label} width={24} height={24} />
              {link.label}
            </Link>
          );
        })}
      </div>
      {/* Utilisateur à droite */}
      <div className="flex items-center gap-0 z-10">
        <Link
          href="/credits"
          className={"w-12 h-12 flex items-center justify-center rounded-full transition-all text-sm font-medium text-gray-200 hover:bg-white/10"}
          title="Buy Credits"
        >
          <Image src="/assets/icons/coins-8.png" alt="Buy Credits" width={44} height={44} className="object-contain" />
        </Link>
        <Link
          href="/profile"
          className={"w-12 h-12 flex items-center justify-center rounded-full transition-all text-sm font-medium text-gray-200 hover:bg-white/10"}
          title="Profile"
        >
          <Image src="/assets/icons/profil-3d.png" alt="Profile" width={38} height={38} className="object-contain" />
        </Link>
        <div className="w-12 h-12 flex items-center justify-center">
          <ThemeButton className="!w-8 !h-8" />
        </div>
        <div className="w-12 h-12 flex items-center justify-center">
          <SignedIn>
            <div className="w-8 h-8 flex items-center justify-center">
              <UserButton afterSignOutUrl='/' appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
            </div>
          </SignedIn>
          <SignedOut>
            <Button asChild className="button bg-purple-gradient bg-cover w-8 h-8 p-0 flex items-center justify-center text-xs">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;