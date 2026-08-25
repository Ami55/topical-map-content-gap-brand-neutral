import React, { useState } from 'react';
import { 
  Users2, 
  Search, 
  ExternalLink, 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  Compass, 
  Globe 
} from 'lucide-react';
import { CompetitorAnalysis } from '../types';

interface CompetitorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  competitors: CompetitorAnalysis[];
}

export const CompetitorsModal: React.FC<CompetitorsModalProps> = ({
  isOpen,
  onClose,
  competitors,
}) => {
  const [selectedCompIndex, setSelectedCompIndex] = useState(0);

  if (!isOpen) return null;

  const current = competitors[selectedCompIndex] || competitors[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Users2 className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Competitor Topical & Architectural Intelligence
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Step 4: Comparative topic structures, category taxonomies, and high-ranking page formats across {competitors.length} competitors.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg text-lg"
          >
            ×
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 overflow-x-auto px-6 pt-3">
          {competitors.map((comp, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCompIndex(idx)}
              className={`px-4 py-2 text-xs font-mono font-semibold border-b-2 whitespace-nowrap transition ${
                selectedCompIndex === idx
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900 rounded-t-lg'
                  : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              {comp.domain}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        {current && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Competitor Domain</span>
                <span className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-1 block truncate">
                  {current.domain}
                </span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated Indexed Breadth</span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-1 block">
                  ~{current.discoveredPagesCount.toLocaleString()} URLs
                </span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Identified Patterns</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1 block">
                  {current.repeatedTopicPatterns.length} Distinct Archetypes
                </span>
              </div>
            </div>

            {/* Repeated Topic & Taxonomy Patterns */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Topical Structure & Repeated Page Patterns
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {current.repeatedTopicPatterns.map((pat, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{pat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Commercial vs Informational Split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                  Commercial Architecture
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {current.commercialVsInformational.commercialStructure}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 space-y-2">
                <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider block">
                  Informational & Content Architecture
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {current.commercialVsInformational.informationalStructure}
                </p>
              </div>
            </div>

            {/* Shared vs Unique Topics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                  Shared Overlapping Topics With You ({current.sharedTopics.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {current.sharedTopics.map((topic, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                  Unique Topics Discovered on Competitor ({current.uniqueTopics.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {current.uniqueTopics.map((topic, uIdx) => (
                    <span
                      key={uIdx}
                      className="px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
