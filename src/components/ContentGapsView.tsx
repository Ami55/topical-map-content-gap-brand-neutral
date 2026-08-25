import React, { useState, useMemo } from 'react';
import { 
  AlertCircle, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ExternalLink, 
  Download, 
  Sparkles, 
  TrendingUp, 
  Users2, 
  Layers,
  ArrowRight,
  EyeOff,
  Eye
} from 'lucide-react';
import { ContentGap, GapType, PriorityLevel, BusinessRelevance } from '../types';
import { exportContentGapsCsv } from '../lib/csvExport';

interface ContentGapsViewProps {
  gaps: ContentGap[];
  onUpdateGap: (gap: ContentGap) => void;
  onAddGap: (gap: ContentGap) => void;
  onDeleteGap: (id: string) => void;
  onNavigateToTopicalMap: () => void;
  projectName: string;
}

export const ContentGapsView: React.FC<ContentGapsViewProps> = ({
  gaps,
  onUpdateGap,
  onAddGap,
  onDeleteGap,
  onNavigateToTopicalMap,
  projectName,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showDismissed, setShowDismissed] = useState(false);

  // Add Custom Gap state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGapName, setNewGapName] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newPrimaryKw, setNewPrimaryKw] = useState('');
  const [newGapType, setNewGapType] = useState<GapType>('Missing commercial coverage');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('High');
  const [newPageType, setNewPageType] = useState('Tour category / Shore excursion');
  const [newAction, setNewAction] = useState('');
  const [newCompetitors, setNewCompetitors] = useState('');
  const [newEvidence, setNewEvidence] = useState('');

  const filteredGaps = useMemo(() => {
    return gaps.filter(g => {
      if (!showDismissed && g.isDismissed) return false;
      if (showDismissed && !g.isDismissed) return false;

      if (selectedType !== 'all' && g.gapType !== selectedType) return false;
      if (selectedPriority !== 'all' && g.priority !== selectedPriority) return false;

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchName = g.gapName.toLowerCase().includes(term);
        const matchTopic = g.topic.toLowerCase().includes(term);
        const matchKw = (g.primaryKeyword || '').toLowerCase().includes(term);
        const matchAction = g.suggestedAction.toLowerCase().includes(term);
        if (!matchName && !matchTopic && !matchKw && !matchAction) return false;
      }
      return true;
    });
  }, [gaps, showDismissed, selectedType, selectedPriority, searchTerm]);

  const handleCreateGap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGapName.trim() || !newTopic.trim()) return;

    const gap: ContentGap = {
      id: `gap_custom_${Date.now()}`,
      gapName: newGapName.trim(),
      topic: newTopic.trim(),
      primaryKeyword: newPrimaryKw.trim() || undefined,
      gapType: newGapType,
      priority: newPriority,
      businessRelevance: 'Strongly relevant',
      competitorsCovering: newCompetitors.split(',').map(s => s.trim()).filter(Boolean),
      competitorExampleUrls: [],
      recommendedPageType: newPageType.trim(),
      suggestedAction: newAction.trim() || 'Create a dedicated high-intent landing page.',
      evidence: newEvidence.trim() || 'Manual user-identified high opportunity topic.',
      confidence: 'High',
      isDismissed: false,
    };

    onAddGap(gap);
    setIsAddModalOpen(false);
    setNewGapName('');
    setNewTopic('');
    setNewPrimaryKw('');
    setNewAction('');
    setNewCompetitors('');
    setNewEvidence('');
  };

  const toggleDismissGap = (gap: ContentGap) => {
    onUpdateGap({ ...gap, isDismissed: !gap.isDismissed });
  };

  const getPriorityBadge = (p: PriorityLevel) => {
    switch (p) {
      case 'High':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Low':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getGapTypeBadge = (t: GapType) => {
    switch (t) {
      case 'Missing commercial coverage':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Missing page':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Competitor advantage':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Customer-journey gap':
        return 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800';
      case 'Weak existing page':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <span>Content Gap & Competitor Opportunity Analysis</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Prioritized content omissions, missing commercial hubs, informational guide holes, and competitor ranking advantages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportContentGapsCsv(gaps, projectName)}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Gaps CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Gap</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search gaps, topics, primary keywords, actions..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <button
            onClick={() => setShowDismissed(!showDismissed)}
            className={`px-3 py-2 text-xs rounded-lg border font-medium transition flex items-center space-x-1.5 ${
              showDismissed
                ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300'
                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {showDismissed ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showDismissed ? 'Viewing Dismissed Gaps' : 'Active Gaps'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Gap Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs"
            >
              <option value="all">All Gap Types</option>
              <option value="Missing commercial coverage">Missing Commercial Coverage</option>
              <option value="Missing page">Missing Page</option>
              <option value="Missing informational support">Missing Informational Support</option>
              <option value="Competitor advantage">Competitor Advantage</option>
              <option value="Weak existing page">Weak Existing Page</option>
              <option value="Customer-journey gap">Customer Journey Gap</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Priority</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs"
            >
              <option value="all">All Priorities ({gaps.length})</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Gaps Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGaps.map((gap) => (
          <div
            key={gap.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
          >
            {/* Top Bar: Badges & Actions */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPriorityBadge(gap.priority)}`}>
                    {gap.priority} Priority
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getGapTypeBadge(gap.gapType)}`}>
                    {gap.gapType}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white pt-1">
                  {gap.gapName}
                </h3>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => toggleDismissGap(gap)}
                  className="p-1.5 text-slate-400 hover:text-amber-500 rounded transition"
                  title={gap.isDismissed ? "Restore gap" : "Dismiss gap"}
                >
                  {gap.isDismissed ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => onDeleteGap(gap.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded transition"
                  title="Delete gap"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Target keyword & Topic */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Core Topic</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{gap.topic}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Primary Target Keyword</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{gap.primaryKeyword || 'N/A'}</span>
              </div>
            </div>

            {/* Strategic Recommended Action */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-500">Recommended Action</span>
                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 font-semibold">{gap.recommendedPageType}</span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 font-medium">
                {gap.suggestedAction}
              </p>
            </div>

            {/* Evidence & Competitor Proof */}
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Competitors Dominating This Topic ({gap.competitorsCovering.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {gap.competitorsCovering.map((comp, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-mono text-[11px]"
                    >
                      {comp}
                    </span>
                  ))}
                  {gap.competitorsCovering.length === 0 && (
                    <span className="text-slate-400 italic">None specified</span>
                  )}
                </div>
              </div>

              {gap.evidence && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Evidence & Analysis</span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    {gap.evidence}
                  </p>
                </div>
              )}
            </div>

            {/* Action CTA */}
            <div className="pt-2">
              <button
                onClick={onNavigateToTopicalMap}
                className="w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
              >
                <span>View Architecture in Topical Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredGaps.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400">
            No content gaps found matching your filter criteria.
          </div>
        )}
      </div>

      {/* Add Custom Gap Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Add Custom Content Gap
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 text-lg">×</button>
            </div>

            <form onSubmit={handleCreateGap} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Gap Name *
                </label>
                <input
                  type="text"
                  required
                  value={newGapName}
                  onChange={(e) => setNewGapName(e.target.value)}
                  placeholder="e.g. Missing Civitavecchia Port Shore Excursions"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Core Topic *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="e.g. Shore Excursions"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Primary Keyword
                  </label>
                  <input
                    type="text"
                    value={newPrimaryKw}
                    onChange={(e) => setNewPrimaryKw(e.target.value)}
                    placeholder="e.g. civitavecchia cruise port private tour"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Gap Type
                  </label>
                  <select
                    value={newGapType}
                    onChange={(e) => setNewGapType(e.target.value as GapType)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Missing commercial coverage">Missing commercial coverage</option>
                    <option value="Missing page">Missing page</option>
                    <option value="Missing informational support">Missing informational support</option>
                    <option value="Competitor advantage">Competitor advantage</option>
                    <option value="Weak existing page">Weak existing page</option>
                    <option value="Customer-journey gap">Customer-journey gap</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Suggested Strategic Action
                </label>
                <textarea
                  rows={2}
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  placeholder="e.g. Build dedicated port landing page with pickup times, guide bookings, and vehicle options."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Competitors Covering (comma-separated)
                </label>
                <input
                  type="text"
                  value={newCompetitors}
                  onChange={(e) => setNewCompetitors(e.target.value)}
                  placeholder="e.g. viator.com, getyourguide.com"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Add Gap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
