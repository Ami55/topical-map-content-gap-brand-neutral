import React, { useState, useMemo } from 'react';
import { Layers, Search, Filter, Tag, Compass, Download } from 'lucide-react';
import { KeywordItem } from '../types';
import { exportCategoriesCsv } from '../lib/csvExport';

interface CategoriesViewProps {
  keywords: KeywordItem[];
  projectName: string;
}

type GroupBy = 'coreTopic' | 'subtopic' | 'mainEntity' | 'searchIntent' | 'journeyStage';

export const CategoriesView: React.FC<CategoriesViewProps> = ({ keywords, projectName }) => {
  const [groupBy, setGroupBy] = useState<GroupBy>('coreTopic');
  const [searchQuery, setSearchQuery] = useState('');

  // Grouping computation
  const groups = useMemo(() => {
    const map: Record<string, KeywordItem[]> = {};

    keywords.forEach(k => {
      if (k.isRemoved) return;
      let key = '';
      if (groupBy === 'coreTopic') key = k.coreTopic || 'Uncategorized';
      else if (groupBy === 'subtopic') key = `${k.coreTopic} > ${k.subtopic || 'General'}`;
      else if (groupBy === 'mainEntity') key = k.mainEntity || 'General Entity';
      else if (groupBy === 'searchIntent') key = k.searchIntent || 'Mixed';
      else if (groupBy === 'journeyStage') key = k.journeyStage || 'Awareness';

      if (!map[key]) map[key] = [];
      map[key].push(k);
    });

    // Sort by count descending
    return Object.entries(map)
      .sort((a, b) => b[1].length - a[1].length)
      .filter(([groupName]) => {
        if (!searchQuery) return true;
        return groupName.toLowerCase().includes(searchQuery.toLowerCase());
      });
  }, [keywords, groupBy, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-500" />
            <span>Semantic Categorization & Entities</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Explore semantically grouped search needs across core topics, subtopics, named entities, intent archetypes, and customer journey phases.
          </p>
        </div>

        <button
          onClick={() => exportCategoriesCsv(keywords, projectName)}
          className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center space-x-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Categories CSV</span>
        </button>
      </div>

      {/* Group Switcher & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Dimension Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Group By:</span>
          {(
            [
              { id: 'coreTopic', label: 'Core Topic' },
              { id: 'subtopic', label: 'Subtopic' },
              { id: 'mainEntity', label: 'Entity' },
              { id: 'searchIntent', label: 'Search Intent' },
              { id: 'journeyStage', label: 'Customer Journey' },
            ] as { id: GroupBy; label: string }[]
          ).map((dim) => (
            <button
              key={dim.id}
              onClick={() => setGroupBy(dim.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                groupBy === dim.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {dim.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Filter ${groupBy}...`}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(([groupName, items]) => {
          const commercialCount = items.filter(
            i => i.searchIntent === 'Commercial investigation' || i.searchIntent === 'Transactional'
          ).length;
          const informationalCount = items.filter(
            i => i.searchIntent === 'Informational'
          ).length;

          return (
            <div
              key={groupName}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {groupName}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{items.length} keywords</span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{commercialCount} commercial</span>
                    <span>•</span>
                    <span className="text-purple-600 dark:text-purple-400">{informationalCount} info</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold">
                  {items.length}
                </span>
              </div>

              {/* Keywords list */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Keywords ({items.length})
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {items.map((k) => (
                    <span
                      key={k.id}
                      className="inline-flex items-center text-xs px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-mono"
                    >
                      {k.keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {groups.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400">
            No categories found matching your query.
          </div>
        )}
      </div>
    </div>
  );
};
