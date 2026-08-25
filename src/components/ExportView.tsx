import React from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  FileText, 
  Layers, 
  FolderTree, 
  Link2, 
  AlertCircle, 
  Network,
  Sparkles
} from 'lucide-react';
import { FullProjectState } from '../types';
import { 
  exportKeywordsCsv, 
  exportCategoriesCsv, 
  exportClustersCsv, 
  exportPageMappingCsv, 
  exportContentGapsCsv, 
  exportTopicalMapCsv, 
  exportInternalLinksCsv,
  exportMasterCsv
} from '../lib/csvExport';

interface ExportViewProps {
  state: FullProjectState;
}

export const ExportView: React.FC<ExportViewProps> = ({ state }) => {
  const { project, keywords, clusters, mappings, gaps, topicalMap } = state;
  const projectName = project.projectName || 'seo-topical-research';

  const exportOptions = [
    {
      id: 'master',
      title: 'Master Keyword-to-Page & Gaps Export (Complete)',
      description: 'Unified sheet with core topics, subtopics, clusters, primary/secondary keywords, existing URLs, mapping strengths, competitor evidence, and action priorities.',
      icon: Sparkles,
      count: mappings.length,
      unit: 'mapped clusters',
      color: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      badge: 'Recommended',
      action: () => exportMasterCsv(topicalMap, mappings, clusters, gaps, projectName)
    },
    {
      id: 'keywords',
      title: '1. All Discovered Keywords',
      description: 'Complete list of search phrases with core topics, subtopics, search intent, page types, business relevance, and query patterns.',
      icon: FileSpreadsheet,
      count: keywords.length,
      unit: 'keywords',
      color: 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white',
      action: () => exportKeywordsCsv(keywords, projectName)
    },
    {
      id: 'categories',
      title: '2. Keyword Categories & Entities',
      description: 'Semantic groupings categorized by core topic, subtopic, and named entity with keyword counts.',
      icon: Layers,
      count: clusters.length,
      unit: 'categories',
      color: 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white',
      action: () => exportCategoriesCsv(keywords, projectName)
    },
    {
      id: 'clusters',
      title: '3. Keyword Clusters',
      description: 'Page-level keyword clusters grouping primary and secondary search terms by single-page intent.',
      icon: FolderTree,
      count: clusters.length,
      unit: 'clusters',
      color: 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white',
      action: () => exportClustersCsv(clusters, projectName)
    },
    {
      id: 'mapping',
      title: '4. Keyword-to-Page Mapping',
      description: 'Full inventory mapping clusters to existing live URLs, mapping strength ratings, and cannibalization alerts.',
      icon: Link2,
      count: mappings.length,
      unit: 'page mappings',
      color: 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white',
      action: () => exportPageMappingCsv(mappings, clusters, gaps, projectName)
    },
    {
      id: 'gaps',
      title: '5. Content Gaps & Opportunities',
      description: 'Missing commercial pages, guide holes, competitor advantages, and prioritized creation actions.',
      icon: AlertCircle,
      count: gaps.length,
      unit: 'identified gaps',
      color: 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white',
      action: () => exportContentGapsCsv(gaps, projectName)
    },
    {
      id: 'topical-map',
      title: '6. Practical Topical Map',
      description: 'Structured site hierarchy detailing pillar hubs, commercial pages, supporting guides, and clean URL slugs.',
      icon: Network,
      count: topicalMap.length,
      unit: 'planned pages',
      color: 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white',
      action: () => exportTopicalMapCsv(topicalMap, projectName)
    },
    {
      id: 'internal-links',
      title: '7. Internal-Link Recommendations',
      description: 'Step 11 internal linking matrix: source pages, target URLs, natural anchor texts, and strategic link relationships.',
      icon: Link2,
      count: topicalMap.reduce((acc, p) => acc + p.internalLinks.length, 0),
      unit: 'link directives',
      color: 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white',
      action: () => exportInternalLinksCsv(topicalMap, projectName)
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <Download className="w-3.5 h-3.5" />
            <span>Step 14: CSV Export Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Export Research & Execution Plans
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Download your comprehensive SEO data in standard CSV format compatible with Google Sheets, Excel, Airtable, and Notion.
          </p>
        </div>

        <button
          onClick={() => exportMasterCsv(topicalMap, mappings, clusters, gaps, projectName)}
          className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition flex items-center space-x-2 flex-shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Download All Data (Master CSV)</span>
        </button>
      </div>

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exportOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <div
              key={opt.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      <Icon className="w-4 h-4 text-emerald-500" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {opt.title}
                    </h3>
                  </div>
                  {opt.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {opt.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {opt.description}
                </p>

                <div className="text-[11px] font-mono text-slate-500">
                  Contains: <span className="font-bold text-slate-800 dark:text-slate-200">{opt.count} {opt.unit}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={opt.action}
                  className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold shadow-sm transition flex items-center justify-center space-x-2 ${opt.color}`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download {opt.title.split('.')[1] || opt.title} CSV</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
