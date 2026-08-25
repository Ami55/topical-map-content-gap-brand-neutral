import React, { useState, useMemo } from 'react';
import { 
  Network, 
  Search, 
  Filter, 
  ExternalLink, 
  Link2, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ChevronDown, 
  Layers, 
  FileText, 
  ArrowUpRight,
  Sparkles,
  Info,
  Compass
} from 'lucide-react';
import { 
  TopicalMapPage, 
  PageStatus, 
  PageRole, 
  SearchIntent 
} from '../types';
import { exportTopicalMapCsv, exportInternalLinksCsv } from '../lib/csvExport';

interface TopicalMapViewProps {
  topicalMap: TopicalMapPage[];
  projectName: string;
}

export const TopicalMapView: React.FC<TopicalMapViewProps> = ({
  topicalMap,
  projectName,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPageId, setSelectedPageId] = useState<string | null>(topicalMap[0]?.id || null);

  // Selected page for deep inspection drawer
  const selectedPage = useMemo(() => {
    return topicalMap.find(p => p.id === selectedPageId) || topicalMap[0] || null;
  }, [topicalMap, selectedPageId]);

  // Group pages by Pillar / Parent Topic
  const groupedByParent = useMemo<Record<string, TopicalMapPage[]>>(() => {
    const map: Record<string, TopicalMapPage[]> = {};
    topicalMap.forEach(page => {
      // Filter checks
      if (selectedRole !== 'all' && page.pageRole !== selectedRole) return;
      if (selectedStatus !== 'all' && page.status !== selectedStatus) return;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchName = page.pageName.toLowerCase().includes(term);
        const matchKw = page.primaryKeyword.toLowerCase().includes(term);
        const matchUrl = (page.existingUrl || page.suggestedUrl).toLowerCase().includes(term);
        if (!matchName && !matchKw && !matchUrl) return;
      }

      const parent = page.parentTopic || 'Main Hub';
      if (!map[parent]) map[parent] = [];
      map[parent].push(page);
    });
    return map;
  }, [topicalMap, selectedRole, selectedStatus, searchTerm]);

  const getStatusBadge = (status: PageStatus) => {
    switch (status) {
      case 'Existing and properly mapped':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Existing but needs optimization':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Existing but weak':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Missing page':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'Possible overlap':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Future opportunity':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getRoleBadge = (role: PageRole | string) => {
    switch (role) {
      case 'Pillar Hub':
      case 'Pillar / Hub page':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Commercial Destination':
      case 'Commercial landing page':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Supporting Guide':
      case 'Supporting guide':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-emerald-500" />
            <span>Practical Topical Map & Architecture</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Hierarchical site topology uniting pillars, commercial booking endpoints, educational guides, and bidirectional internal-linking anchors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportInternalLinksCsv(topicalMap, projectName)}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center space-x-1.5"
          >
            <Link2 className="w-3.5 h-3.5 text-blue-500" />
            <span>Export Internal Links CSV</span>
          </button>

          <button
            onClick={() => exportTopicalMapCsv(topicalMap, projectName)}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Topical Map CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search pages, keywords, URLs..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 w-full sm:w-auto text-xs">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs"
          >
            <option value="all">All Page Roles</option>
            <option value="Pillar / Hub page">Pillar / Hub Page</option>
            <option value="Commercial landing page">Commercial Landing Page</option>
            <option value="Supporting guide">Supporting Guide</option>
            <option value="Sub-pillar / Cluster page">Sub-pillar / Cluster Page</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs"
          >
            <option value="all">All Statuses ({topicalMap.length})</option>
            <option value="Missing page">Missing Page</option>
            <option value="Existing and properly mapped">Existing & Mapped</option>
            <option value="Existing but needs optimization">Needs Optimization</option>
            <option value="Existing but weak">Weak Page</option>
            <option value="Possible overlap">Possible Overlap</option>
          </select>
        </div>
      </div>

      {/* Main 2-Column Layout: Topical Map Hierarchy Tree (Left) + Page Inspector & Linking Strategy (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Topical Map Hierarchy */}
        <div className="lg:col-span-7 space-y-6">
          {Object.entries(groupedByParent).map(([parentTopic, pagesList]) => {
            const pages = pagesList as TopicalMapPage[];
            return (
              <div
                key={parentTopic}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
              >
                {/* Hub Header */}
                <div className="bg-slate-50 dark:bg-slate-950 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {parentTopic} Hub
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono font-medium text-slate-500">
                    {pages.length} planned pages
                  </span>
                </div>

                {/* Pages Nodes inside this Hub */}
                <div className="p-3 divide-y divide-slate-100 dark:divide-slate-800/80">
                  {pages.map((page) => {
                    const isSelected = selectedPageId === page.id;
                    return (
                      <div
                        key={page.id}
                        onClick={() => setSelectedPageId(page.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/80 shadow-sm'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-850/50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(page.status)}`}>
                                {page.status}
                              </span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getRoleBadge(page.pageRole)}`}>
                                {page.pageRole}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white pt-0.5">
                              {page.pageName}
                            </h4>
                          </div>

                          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                            <Link2 className="w-3 h-3 text-slate-400" />
                            <span>{page.internalLinks.length} links</span>
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="font-mono text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold">
                            Target: {page.primaryKeyword}
                          </div>
                          <div className="font-mono text-[11px] text-slate-400 truncate max-w-xs">
                            {page.isExisting && page.existingUrl ? page.existingUrl : page.suggestedUrl}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {Object.keys(groupedByParent).length === 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400">
              No pages match the selected filters.
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Deep Page Inspector & Step 11 Internal Linking Strategy */}
        <div className="lg:col-span-5 space-y-6">
          {selectedPage ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6 sticky top-20">
              {/* Header */}
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(selectedPage.status)}`}>
                    {selectedPage.status}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getRoleBadge(selectedPage.pageRole)}`}>
                    {selectedPage.pageRole}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedPage.pageName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Parent Topic: <span className="text-slate-800 dark:text-slate-200 font-bold">{selectedPage.parentTopic}</span>
                </p>
              </div>

              {/* Keyword & URL Profile */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Primary Head Keyword
                  </span>
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                    {selectedPage.primaryKeyword}
                  </div>
                </div>

                {selectedPage.secondaryKeywords.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Secondary Supporting Keywords ({selectedPage.secondaryKeywords.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedPage.secondaryKeywords.map((sec, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-700">
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Search Intent</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPage.searchIntent}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Recommended Page Type</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{selectedPage.recommendedPageType}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    {selectedPage.isExisting ? 'Existing Mapped URL' : 'Recommended Clean URL Slug'}
                  </span>
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-blue-600 dark:text-blue-400 flex items-center justify-between truncate">
                    <span className="truncate">{selectedPage.isExisting ? selectedPage.existingUrl : selectedPage.suggestedUrl}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-sans font-semibold ${selectedPage.isExisting ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'}`}>
                      {selectedPage.isExisting ? 'Live' : 'New'}
                    </span>
                  </div>
                </div>

                {selectedPage.recommendedAction && (
                  <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                      Recommended Strategic Action
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 text-xs">
                      {selectedPage.recommendedAction}
                    </p>
                  </div>
                )}
              </div>

              {/* STEP 11: INTERNAL LINKING RECOMMENDATIONS */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>Internal Link Strategy ({selectedPage.internalLinks.length})</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">Step 11 Architecture</span>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {selectedPage.internalLinks.map((link, lIdx) => (
                    <div
                      key={lIdx}
                      className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">
                          → {link.targetPageName}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {link.linkRelationship}
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-slate-500 truncate">
                        Target: {link.targetUrl}
                      </div>

                      <div className="pt-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          Recommended Natural Anchor Texts:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {link.suggestedAnchorText.map((anchor, aIdx) => (
                            <span key={aIdx} className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                              "{anchor}"
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 italic pt-0.5">
                        Strategic Reason: {link.reasonForLink}
                      </p>
                    </div>
                  ))}

                  {selectedPage.internalLinks.length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-4">
                      No internal links mapped for this page.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-400">
              <Info className="w-6 h-6 mx-auto mb-2 text-slate-400" />
              Select a page on the left to inspect keyword targeting and internal-linking hierarchy.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
