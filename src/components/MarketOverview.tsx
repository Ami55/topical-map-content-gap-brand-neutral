import React from 'react';
import { 
  Compass, 
  Search, 
  FolderTree, 
  FileCode2, 
  Link2, 
  AlertCircle, 
  ArrowUpRight, 
  TrendingUp, 
  CheckCircle2, 
  Users2, 
  Layers, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { FullProjectState } from '../types';
import { NavTab } from './Navbar';

interface MarketOverviewProps {
  state: FullProjectState;
  onNavigateTab: (tab: NavTab) => void;
  onOpenInventory: () => void;
  onOpenCompetitors: () => void;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({
  state,
  onNavigateTab,
  onOpenInventory,
  onOpenCompetitors,
}) => {
  const { project, businessProfile, existingPages, competitors, keywords, clusters, mappings, gaps, topicalMap } = state;

  const missingPagesCount = mappings.filter(m => m.mappingStrength === 'No matching page').length;
  const highPriorityGaps = gaps.filter(g => g.priority === 'High' && !g.isDismissed);
  const mappedPagesCount = mappings.filter(m => m.mappingStrength === 'Strong match' || m.mappingStrength === 'Partial match').length;
  const coverageScore = clusters.length > 0 
    ? Math.round((mappedPagesCount / clusters.length) * 100) 
    : 0;

  // Intent breakdown
  const intentCounts: Record<string, number> = {};
  keywords.forEach(k => {
    intentCounts[k.searchIntent] = (intentCounts[k.searchIntent] || 0) + 1;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <Compass className="w-3.5 h-3.5" />
            <span>Market & Semantic Authority Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Market Overview: {project.projectName}
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Synthesizing existing website inventory, competitor structures, page-level search intents, and high-priority content gaps for <span className="font-mono text-emerald-400 font-semibold">{project.websiteDomain}</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('topical-map')}
            className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-md flex items-center space-x-2"
          >
            <span>Explore Topical Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigateTab('gaps')}
            className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-semibold text-xs transition flex items-center space-x-2"
          >
            <span>View Content Gaps</span>
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>

      {/* 6 High-Level Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div 
          onClick={() => onNavigateTab('keywords')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <Search className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] uppercase font-bold text-slate-500">Step 5</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{keywords.length}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Keywords Discovered</div>
        </div>

        <div 
          onClick={() => onNavigateTab('clusters')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <FolderTree className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] uppercase font-bold text-slate-500">Step 7</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{clusters.length}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Intent Clusters</div>
        </div>

        <div 
          onClick={onOpenInventory}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <FileCode2 className="w-4 h-4 text-purple-500" />
            <span className="text-[10px] uppercase font-bold text-slate-500">Step 3</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{existingPages.length}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Pages Crawled</div>
        </div>

        <div 
          onClick={() => onNavigateTab('mapping')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <Link2 className="w-4 h-4 text-teal-500" />
            <span className="text-[10px] uppercase font-bold text-slate-500">Step 8</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{mappedPagesCount}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Existing Mapped</div>
        </div>

        <div 
          onClick={() => onNavigateTab('gaps')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] uppercase font-bold text-slate-500">Step 9</span>
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{highPriorityGaps.length}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">High-Priority Gaps</div>
        </div>

        <div 
          onClick={() => onNavigateTab('topical-map')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] uppercase font-bold text-slate-500">Step 10</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{coverageScore}%</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Topical Coverage</div>
        </div>
      </div>

      {/* Grid: Core Business Pillars & High Priority Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Core Business Profile & Topic Architecture */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-500" />
                <span>Core Business Topics & Scope</span>
              </h3>
              <button
                onClick={() => onNavigateTab('project')}
                className="text-xs text-emerald-600 hover:text-emerald-500 font-medium"
              >
                Edit in Step 1
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <span className="text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
                  Commercial Hub Categories ({businessProfile?.commercialTopics?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {businessProfile?.commercialTopics?.map((topic, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
                  Informational & Educational Pillars ({businessProfile?.informationalTopics?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {businessProfile?.informationalTopics?.map((topic, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-medium">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
                  Location & Geographic Scopes ({businessProfile?.locationRelatedTopics?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {businessProfile?.locationRelatedTopics?.map((topic, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
                  Excluded Non-Relevant Topics ({businessProfile?.outsideScopeTopics?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {businessProfile?.outsideScopeTopics?.map((topic, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-medium">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Search Intent Distribution */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center justify-between">
              <span>Search Intent Breakdown</span>
              <span className="text-xs text-slate-500 font-normal">{keywords.length} total keywords</span>
            </h3>

            <div className="space-y-2.5">
              {Object.entries(intentCounts).map(([intent, count]) => {
                const pct = Math.round((count / keywords.length) * 100);
                return (
                  <div key={intent} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700 dark:text-slate-300">{intent}</span>
                      <span className="text-slate-500">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${pct}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: High Priority Gaps & Competitor Comparison */}
        <div className="lg:col-span-7 space-y-6">
          {/* High Priority Gaps */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span>High-Priority Content & Commercial Gaps</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Missing pages where competitors have established topical dominance.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('gaps')}
                className="text-xs text-emerald-600 hover:text-emerald-500 font-medium flex items-center space-x-1"
              >
                <span>View All ({gaps.length})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {highPriorityGaps.slice(0, 4).map((gap) => (
                <div 
                  key={gap.id}
                  className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        {gap.gapType}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {gap.gapName}
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                      High Priority
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {gap.suggestedAction}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Competitors:</span> {gap.competitorsCovering.join(', ')}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Recommended Type:</span> {gap.recommendedPageType}
                    </div>
                  </div>
                </div>
              ))}

              {highPriorityGaps.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No high priority gaps currently identified.
                </div>
              )}
            </div>
          </div>

          {/* Competitor Benchmark Overview */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Users2 className="w-4 h-4 text-blue-500" />
                <span>Competitor Structural Benchmarks</span>
              </h3>
              <button
                onClick={onOpenCompetitors}
                className="text-xs text-blue-600 hover:text-blue-500 font-medium"
              >
                Deep Dive Modal
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {competitors.map((comp, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white font-mono text-xs">
                      {comp.domain}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      ~{comp.discoveredPagesCount.toLocaleString()} indexable pages
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-semibold block mb-1">Key Content & Category Patterns:</span>
                    <div className="flex flex-wrap gap-1">
                      {comp.repeatedTopicPatterns.slice(0, 3).map((pattern, pIdx) => (
                        <span key={pIdx} className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-[11px]">
                          {pattern}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
