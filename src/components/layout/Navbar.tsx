
import React, { useState, useEffect } from 'react';
// next/link replaced with anchor
import { Sparkles, Upload, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/AppThemeToggle';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Trang chủ' },
    { href: '/face-enhancement', label: 'Face Enhancement' },
    { href: '#how-it-works', label: 'Cách sử dụng' },
    { href: '#features', label: 'Tính năng' },
    { href: 'https://github.com', label: 'GitHub', external: true },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 w-full',
        'transition-all duration-300 ease-out',
        scrolled ? 'pt-2' : 'pt-0'
      )}
    >
      <nav className="w-full px-2 sm:px-4">
        <div
          className={cn(
            'mx-auto transition-all duration-300 ease-out',
            // Default state (top of page)
            'max-w-7xl px-4 sm:px-6 lg:px-8',
            // Scrolled state - glassmorphism effect like jarvis.cx
            scrolled && [
              'max-w-5xl',
              'bg-white/60 dark:bg-slate-800/60',
              'backdrop-blur-xl',
              'rounded-2xl',
              'border border-slate-200/60 dark:border-slate-700/60',
              'shadow-lg shadow-primary/5 dark:shadow-primary/10',
              'px-4 sm:px-6',
            ]
          )}
        >
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 overflow-hidden',
                  scrolled && 'shadow-glow-purple'
                )}
              >
                <img 
                  src="/logo-icon.png" 
                  alt="AI Upscaler Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-heading font-bold text-indigo-950 dark:text-slate-100">
                AI Upscaler
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                // Sử dụng Next.js Link cho internal routes, <a> cho external và hash links
                const isInternal = !link.external && !link.href.startsWith('#');
                
                if (isInternal) {
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  );
                }
                
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            {/* Theme Toggle & Mobile Menu */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-slate-600" />
                ) : (
                  <Menu className="w-6 h-6 text-slate-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={cn(
              'md:hidden overflow-hidden transition-all duration-300 ease-out',
              mobileMenuOpen ? 'max-h-48 pb-4' : 'max-h-0'
            )}
          >
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              {navLinks.map((link) => {
                // Sử dụng Next.js Link cho internal routes, <a> cho external và hash links
                const isInternal = !link.external && !link.href.startsWith('#');
                
                if (isInternal) {
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      {link.label}
                    </a>
                  );
                }
                
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
