import React from 'react';
import { 
  Globe, 
  Layers, 
  Search, 
  FolderTree, 
  Link2, 
  AlertCircle, 
  Network, 
  Download, 
  SlidersHorizontal,
  Compass,
  FileCode2,
  Users2,
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { FullProjectState } from '../types';

export type NavTab = 
  | 'project' 
  | 'overview' 
  | 'keywords' 
  | 'categories' 
  | 'clusters' 
  | 'mapping' 
  | 'gaps' 
  | 'topical-map' 
  | 'export';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  state: FullProjectState | null;
  isLoading: boolean;
  onOpenInventory: () => void;
  onOpenCompetitors: () => void;
  onRerunAnalysis: () => void;
  onStartNewAnalysis: () => void;
  onOpenHowItWorks: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  state,
  isLoading,
  onOpenInventory,
  onOpenCompetitors,
  onRerunAnalysis,
  onStartNewAnalysis,
  onOpenHowItWorks
}) => {
  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: number | string }[] = [
    { id: 'project', label: '1. Project', icon: SlidersHorizontal },
    { id: 'overview', label: '2. Market Overview', icon: Compass },
    { id: 'keywords', label: '3. Keywords', icon: Search, badge: state?.keywords?.length },
    { id: 'categories', label: '4. Categories', icon: Layers },
    { id: 'clusters', label: '5. Keyword Clusters', icon: FolderTree, badge: state?.clusters?.length },
    { id: 'mapping', label: '6. Page Mapping', icon: Link2, badge: state?.mappings?.length },
    { id: 'gaps', label: '7. Content Gaps', icon: AlertCircle, badge: state?.gaps?.filter(g => !g.isDismissed)?.length },
    { id: 'topical-map', label: '8. Topical Map', icon: Network, badge: state?.topicalMap?.length },
    { id: 'export', label: '9. Export', icon: Download }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      {/* Top utility bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 border-b border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm ring-1 ring-emerald-400/30">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-white">Topical Map</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-medium border border-emerald-800/60">
                  Content Gap Finder
                </span>
              </div>
              {state?.project?.projectName && (
                <p className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">
                  {state.project.projectName} • <span className="text-slate-300 font-mono">{state.project.websiteDomain}</span>
                </p>
              )}
            </div>
          </div>

          {/* Quick Tools & State controls */}
          <div className="flex items-center space-x-2">
            <button
              id="nav-btn-how-it-works"
              onClick={onOpenHowItWorks}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-700/60 transition shadow-sm"
              title="Learn how the 9-step Topical Map methodology works"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>How It Works</span>
            </button>

            {state && (
              <>
                <button
                  id="nav-btn-new-analysis"
                  onClick={onStartNewAnalysis}
                  disabled={isLoading}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-700/60 transition disabled:opacity-50"
                  title="Clear the current results and analyze a different website"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New Site Analysis</span>
                </button>

                <button
                  id="nav-btn-inventory"
                  onClick={onOpenInventory}
                  className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition"
                  title="View Discovered Website Pages"
                >
                  <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Site Inventory ({state.existingPages?.length || 0})</span>
                </button>

                <button
                  id="nav-btn-competitors"
                  onClick={onOpenCompetitors}
                  className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition"
                  title="View Competitor Topical Intelligence"
                >
                  <Users2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Competitors ({state.competitors?.length || 0})</span>
                </button>

                <button
                  id="nav-btn-refresh"
                  onClick={onRerunAnalysis}
                  disabled={isLoading}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition disabled:opacity-50"
                  title="Rerun Full AI Research"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-1 scrollbar-none" aria-label="Tabs">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (typeof tab.badge === 'number' ? tab.badge > 0 : Boolean(tab.badge)) && (
                  <span
                    className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      isActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
