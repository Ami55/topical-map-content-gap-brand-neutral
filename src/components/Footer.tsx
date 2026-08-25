import React from 'react';
import { 
  Network, 
  HelpCircle, 
  Sparkles, 
  Layers, 
  ArrowUpRight, 
  Heart,
  Compass,
  FileCode2,
  Users2
} from 'lucide-react';
import { NavTab } from './Navbar';

interface FooterProps {
  onOpenHowItWorks: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onOpenInventory?: () => void;
  onOpenCompetitors?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenHowItWorks,
  onNavigateTab,
  onOpenInventory,
  onOpenCompetitors
}) => {
  return (
    <footer className="mt-auto bg-slate-900/90 border-t border-slate-800 text-slate-400 text-xs py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          {/* Brand & Mission */}
          <div className="space-y-1.5 max-w-md">
            <div className="flex items-center space-x-2.5">
              <div className="h-7 w-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm ring-1 ring-emerald-400/30">
                <Network className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm tracking-tight text-white">
                Topical Map & Content Gap Finder
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated entity modeling, SERP keyword clustering, domain inventory mapping, and competitor gap discovery for search engine authority.
            </p>
          </div>

          {/* Quick Step Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="footer-btn-how-it-works"
              onClick={onOpenHowItWorks}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-700/60 transition text-xs font-semibold shadow-sm"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How It Works Guide</span>
            </button>

            {onOpenInventory && (
              <button
                id="footer-btn-inventory"
                onClick={onOpenInventory}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition text-xs font-medium"
              >
                <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Site Inventory</span>
              </button>
            )}

            {onOpenCompetitors && (
              <button
                id="footer-btn-competitors"
                onClick={onOpenCompetitors}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition text-xs font-medium"
              >
                <Users2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Competitors</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Navigation Steps */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Workflow:</span>
            <button onClick={() => onNavigateTab('project')} className="hover:text-emerald-400 transition">1. Project</button>
            <span>•</span>
            <button onClick={() => onNavigateTab('overview')} className="hover:text-emerald-400 transition">2. Market</button>
            <span>•</span>
            <button onClick={() => onNavigateTab('keywords')} className="hover:text-emerald-400 transition">3. Keywords</button>
            <span>•</span>
            <button onClick={() => onNavigateTab('categories')} className="hover:text-emerald-400 transition">4. Categories</button>
            <span>•</span>
            <button onClick={() => onNavigateTab('clusters')} className="hover:text-emerald-400 transition">5. Clusters</button>
            <span>•</span>
            <button onClick={() => onNavigateTab('mapping')} className="hover:text-emerald-400 transition">6. Mapping</button>
            <span>•</span>
            <button onClick={() => onNavigateTab('gaps')} className="hover:text-emerald-400 transition">7. Gaps</button>
            <span>•</span>
            <button onClick={() => onNavigateTab('topical-map')} className="hover:text-emerald-400 transition">8. Topical Map</button>
            <span>•</span>
            <button onClick={() => onNavigateTab('export')} className="hover:text-emerald-400 transition">9. Export</button>
          </div>

          <button
            onClick={onOpenHowItWorks}
            className="text-emerald-400 hover:text-emerald-300 font-medium transition flex items-center space-x-1"
          >
            <span>Read 9-Step Methodology</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Copyright Notice */}
        <div className="pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-400">
            <span className="font-medium text-slate-300">© 2026 Topical Map &amp; Content Gap Finder.</span>
            <span>Developed by <span className="text-emerald-400 font-semibold">Ami - SEO Girl</span>. All rights reserved.</span>
          </div>

          <div className="flex items-center space-x-2 text-slate-500 text-[11px]">
            <span>Semantic Topical Authority Engine</span>
            <span>•</span>
            <span>v2.4.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
