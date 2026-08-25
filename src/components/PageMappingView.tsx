import React, { useState, useMemo } from 'react';
import { 
  Link2, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  ExternalLink, 
  Edit2, 
  Download, 
  HelpCircle,
  FileCode2,
  Sparkles
} from 'lucide-react';
import { 
  PageMapping, 
  MappingStrength, 
  MappingAction, 
  KeywordCluster, 
  DiscoveredPage, 
  ContentGap 
} from '../types';
import { exportPageMappingCsv } from '../lib/csvExport';

interface PageMappingViewProps {
  mappings: PageMapping[];
  clusters: KeywordCluster[];
  existingPages: DiscoveredPage[];
  gaps: ContentGap[];
  onUpdateMapping: (mapping: PageMapping) => void;
  projectName: string;
}

export const PageMappingView: React.FC<PageMappingViewProps> = ({
  mappings,
  clusters,
  existingPages,
  gaps,
  onUpdateMapping,
  projectName,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStrength, setSelectedStrength] = useState<string>('all');
  const [editingMappingId, setEditingMappingId] = useState<string | null>(null);

  // Quick stats
  const strongCount = mappings.filter(m => m.mappingStrength === 'Strong match').length;
  const partialCount = mappings.filter(m => m.mappingStrength === 'Partial match').length;
  const missingCount = mappings.filter(m => m.mappingStrength === 'No matching page').length;
  const cannibalizationCount = mappings.filter(m => m.mappingStrength === 'Possible cannibalization').length;

  const filteredMappings = useMemo(() => {
    return mappings.filter(m => {
      if (selectedStrength !== 'all' && m.mappingStrength !== selectedStrength) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchName = m.clusterName.toLowerCase().includes(term);
        const matchPrimary = m.primaryKeyword.toLowerCase().includes(term);
        const matchUrl = (m.existingUrl || '').toLowerCase().includes(term);
        if (!matchName && !matchPrimary && !matchUrl) return false;
      }
      return true;
    });
  }, [mappings, selectedStrength, searchTerm]);

  const getStrengthBadge = (strength: MappingStrength) => {
    switch (strength) {
      case 'Strong match':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Partial match':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Weak match':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'No matching page':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'Possible cannibalization':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getActionBadge = (action: MappingAction) => {
    switch (action) {
      case 'Create a new page':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Optimize existing page':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Expand existing page':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Keep existing page':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      default:
        return 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const handleUrlReassign = (mapping: PageMapping, selectedUrl: string) => {
    if (!selectedUrl) {
      onUpdateMapping({
        ...mapping,
        existingUrl: undefined,
        existingPageTitle: undefined,
        mappingStrength: 'No matching page',
        recommendedAction: 'Create a new page',
        matchExplanation: 'No relevant page currently exists on your website.'
      });
    } else {
      const page = existingPages.find(p => p.url === selectedUrl);
      onUpdateMapping({
        ...mapping,
        existingUrl: selectedUrl,
        existingPageTitle: page?.title || selectedUrl,
        mappingStrength: 'Partial match',
        recommendedAction: 'Optimize existing page',
        matchExplanation: `Manually reassigned to existing URL: ${selectedUrl}`
      });
    }
    setEditingMappingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Link2 className="w-5 h-5 text-emerald-500" />
            <span>Keyword-to-Page Mapping & Coverage</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Audit how your existing crawled URLs satisfy page-level search intents vs. where new dedicated pages must be created.
          </p>
        </div>

        <button
          onClick={() => exportPageMappingCsv(mappings, clusters, gaps, projectName)}
          className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center space-x-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Mapping CSV</span>
        </button>
      </div>

      {/* 4 Summary Status Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 font-bold uppercase tracking-wider block">Strong Matches</span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">{strongCount}</span>
          <span className="text-[11px] text-slate-500">Fully covered existing pages</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 font-bold uppercase tracking-wider block">Partial Matches</span>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 block">{partialCount}</span>
          <span className="text-[11px] text-slate-500">Need content expansion / revamp</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 font-bold uppercase tracking-wider block">No Matching Page</span>
          <span className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1 block">{missingCount}</span>
          <span className="text-[11px] text-slate-500">New content required</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 font-bold uppercase tracking-wider block">Cannibalization Risk</span>
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1 block">{cannibalizationCount}</span>
          <span className="text-[11px] text-slate-500">Multiple pages targeting same topic</span>
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
            placeholder="Search cluster, keywords, or URL..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto text-xs">
          <span className="text-slate-500 font-medium">Mapping Strength:</span>
          <select
            value={selectedStrength}
            onChange={(e) => setSelectedStrength(e.target.value)}
            className="py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs"
          >
            <option value="all">All Strengths ({mappings.length})</option>
            <option value="Strong match">Strong Match</option>
            <option value="Partial match">Partial Match</option>
            <option value="Weak match">Weak Match</option>
            <option value="No matching page">No Matching Page</option>
            <option value="Cannibalization risk">Cannibalization Risk</option>
          </select>
        </div>
      </div>

      {/* Mappings Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Keyword Cluster</th>
                <th className="py-3.5 px-3">Primary / Secondary Keywords</th>
                <th className="py-3.5 px-3">Current Mapped URL</th>
                <th className="py-3.5 px-3">Strength</th>
                <th className="py-3.5 px-3">Strategic Action</th>
                <th className="py-3.5 px-3">Audit Analysis</th>
                <th className="py-3.5 px-3 text-right">Re-map</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredMappings.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition-colors">
                  {/* Cluster Name */}
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white max-w-xs">
                    <span className="font-bold text-xs block">{m.clusterName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Cluster #{m.clusterId.slice(-6)}</span>
                  </td>

                  {/* Keywords */}
                  <td className="py-3.5 px-3 max-w-xs">
                    <div className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {m.primaryKeyword}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[200px]" title={m.secondaryKeywords.join(', ')}>
                      {m.secondaryKeywords.slice(0, 2).join(', ')}
                      {m.secondaryKeywords.length > 2 ? ` +${m.secondaryKeywords.length - 2} more` : ''}
                    </div>
                  </td>

                  {/* Existing URL */}
                  <td className="py-3.5 px-3 max-w-xs">
                    {editingMappingId === m.id ? (
                      <div className="space-y-1">
                        <select
                          defaultValue={m.existingUrl || ''}
                          onChange={(e) => handleUrlReassign(m, e.target.value)}
                          className="w-full text-[11px] py-1 px-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                        >
                          <option value="">[ No Matching Page - Create New ]</option>
                          {existingPages.map(p => (
                            <option key={p.id} value={p.url}>
                              {p.url} ({p.title.slice(0, 30)}...)
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => setEditingMappingId(null)}
                          className="text-[10px] text-slate-400 hover:text-slate-600 underline"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : m.existingUrl ? (
                      <div className="space-y-0.5">
                        <a
                          href={m.existingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 truncate max-w-[220px]"
                        >
                          <span>{m.existingUrl}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                        {m.existingPageTitle && (
                          <span className="text-[10px] text-slate-400 block truncate max-w-[220px]">
                            {m.existingPageTitle}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center text-[11px] text-slate-400 italic">
                        No matching URL (Missing page)
                      </span>
                    )}
                  </td>

                  {/* Mapping Strength */}
                  <td className="py-3.5 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getStrengthBadge(m.mappingStrength)}`}>
                      {m.mappingStrength}
                    </span>
                  </td>

                  {/* Recommended Action */}
                  <td className="py-3.5 px-3">
                    <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-semibold border ${getActionBadge(m.recommendedAction)}`}>
                      {m.recommendedAction}
                    </span>
                  </td>

                  {/* Audit Analysis / Cannibalization Risk */}
                  <td className="py-3.5 px-3 max-w-sm">
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                      {m.matchExplanation}
                    </p>
                    {m.cannibalizationNotes && (
                      <div className="mt-1 flex items-start gap-1 text-[10px] text-purple-700 dark:text-purple-300 font-medium">
                        <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <span>{m.cannibalizationNotes}</span>
                      </div>
                    )}
                  </td>

                  {/* Action Re-map */}
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => setEditingMappingId(m.id)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 transition rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Reassign or change mapped URL"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredMappings.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No page mappings match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
