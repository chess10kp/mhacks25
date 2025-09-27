import * as React from "react";
import { Wallet, Zap, Settings, HelpCircle } from "lucide-react";

export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-[#3D3D3D]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold text-white">SolMate</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <a
              href="/"
              className="px-4 py-2 text-white/40 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all duration-200 text-sm font-light"
            >
              Features
            </a>
            <a
              href="#"
              className="px-4 py-2 text-white/40 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all duration-200 text-sm font-light"
            >
              Pricing
            </a>
            <a
              href="#"
              className="px-4 py-2 text-white/40 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all duration-200 text-sm font-light"
            >
              Docs
            </a>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            <button className="p-2 text-white/40 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all duration-200">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 text-white/40 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all duration-200">
              <HelpCircle className="w-5 h-5" />
            </button>

            <div className="relative group">
              <button className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-zinc-100 transition-all duration-200 text-sm">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
