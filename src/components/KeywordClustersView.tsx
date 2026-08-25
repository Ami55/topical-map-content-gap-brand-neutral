import React, { useState } from 'react';
import { 
  FolderTree, 
  Plus, 
  Edit3, 
  Trash2, 
  Merge, 
  Split, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Download,
  Tag,
  Search
} from 'lucide-react';
import { KeywordCluster, ConfidenceLevel, SearchIntent } from '../types';
import { exportClustersCsv } from '../lib/csvExport';

interface KeywordClustersViewProps {
  clusters: KeywordCluster[];
  onUpdateCluster: (cluster: KeywordCluster) => void;
  onDeleteCluster: (id: string) => void;
  onMergeClusters: (sourceId: string, targetId: string) => void;
  onAddCluster: (cluster: KeywordCluster) => void;
  projectName: string;
}

export const KeywordClustersView: React.FC<KeywordClustersViewProps> = ({
  clusters,
  onUpdateCluster,
  onDeleteCluster,
  onMergeClusters,
  onAddCluster,
  projectName,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConfidence, setSelectedConfidence] = useState<string>('all');
  const [editingCluster, setEditingCluster] = useState<KeywordCluster | null>(null);

  // Merge state
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [mergeSourceId, setMergeSourceId] = useState('');
  const [mergeTargetId, setMergeTargetId] = useState('');

  // Add cluster state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClusterName, setNewClusterName] = useState('');
  const [newPrimaryKw, setNewPrimaryKw] = useState('');
  const [newSecondaries, setNewSecondaries] = useState('');
  const [newCoreTopic, setNewCoreTopic] = useState('');
  const [newSubtopic, setNewSubtopic] = useState('');
  const [newPageType, setNewPageType] = useState('Tour category');
  const [newIntent, setNewIntent] = useState<SearchIntent>('Commercial investigation');
  const [newReason, setNewReason] = useState('');

  const filteredClusters = clusters.filter(c => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = c.clusterName.toLowerCase().includes(term);
      const matchPrimary = c.primaryKeyword.toLowerCase().includes(term);
      const matchSecondaries = c.secondaryKeywords.some(s => s.toLowerCase().includes(term));
      const matchTopic = c.coreTopic.toLowerCase().includes(term);
      if (!matchName && !matchPrimary && !matchSecondaries && !matchTopic) return false;
    }
    if (selectedConfidence !== 'all' && c.confidence !== selectedConfidence) return false;
    return true;
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCluster) return;
    onUpdateCluster(editingCluster);
    setEditingCluster(null);
  };

  const handleCreateCluster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClusterName.trim() || !newPrimaryKw.trim()) return;

    const cluster: KeywordCluster = {
      id: `cluster_custom_${Date.now()}`,
      clusterName: newClusterName.trim(),
      primaryKeyword: newPrimaryKw.trim(),
      secondaryKeywords: newSecondaries.split(',').map(s => s.trim()).filter(Boolean),
      coreTopic: newCoreTopic.trim() || 'General',
      subtopic: newSubtopic.trim() || 'General',
      searchIntent: newIntent,
      recommendedPageType: newPageType.trim() || 'Landing Page',
      journeyStage: 'Consideration',
      businessRelevance: 'Strongly relevant',
      reasonForGrouping: newReason.trim() || 'Manually defined page-level intent grouping.',
      confidence: 'High',
    };

    onAddCluster(cluster);
    setIsAddModalOpen(false);
    setNewClusterName('');
    setNewPrimaryKw('');
    setNewSecondaries('');
    setNewCoreTopic('');
    setNewSubtopic('');
    setNewReason('');
  };

  const handleExecuteMerge = () => {
    if (!mergeSourceId || !mergeTargetId || mergeSourceId === mergeTargetId) return;
    onMergeClusters(mergeSourceId, mergeTargetId);
    setIsMergeModalOpen(false);
    setMergeSourceId('');
    setMergeTargetId('');
  };

  const getConfidenceBadge = (conf: ConfidenceLevel) => {
    switch (conf) {
      case 'High':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Needs review':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-emerald-500" />
            <span>Page-Level Keyword Clusters</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Keywords grouped strictly by single-URL intent targetability—ensuring distinct pages for distinct search needs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsMergeModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center space-x-1.5"
          >
            <Merge className="w-3.5 h-3.5 text-blue-500" />
            <span>Merge Clusters</span>
          </button>

          <button
            onClick={() => exportClustersCsv(clusters, projectName)}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Clusters CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Cluster</span>
          </button>
        </div>
      </div>

      {/* Search & Confidence Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clusters, keywords, topics..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto text-xs">
          <span className="text-slate-500 font-medium">Confidence:</span>
          <select
            value={selectedConfidence}
            onChange={(e) => setSelectedConfidence(e.target.value)}
            className="py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs"
          >
            <option value="all">All Confidence Levels ({clusters.length})</option>
            <option value="High">High Confidence</option>
            <option value="Medium">Medium Confidence</option>
            <option value="Needs review">Needs Review</option>
          </select>
        </div>
      </div>

      {/* Clusters List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredClusters.map((cluster) => (
          <div
            key={cluster.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
          >
            {/* Header: Title & Badges */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {cluster.coreTopic}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-xs text-slate-500">{cluster.subtopic}</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {cluster.clusterName}
                </h3>
              </div>

              <div className="flex items-center space-x-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getConfidenceBadge(cluster.confidence)}`}>
                  {cluster.confidence}
                </span>
                <button
                  onClick={() => setEditingCluster({ ...cluster })}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Edit cluster"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteCluster(cluster.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Delete cluster"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Primary & Secondary Keywords */}
            <div className="space-y-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                  Primary Head Keyword (Target)
                </span>
                <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-900 dark:text-emerald-200">
                    {cluster.primaryKeyword}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-600 text-white font-bold">
                    Primary
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                  Secondary Supporting Keywords ({cluster.secondaryKeywords.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cluster.secondaryKeywords.map((sec, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-xs px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-mono"
                    >
                      {sec}
                    </span>
                  ))}
                  {cluster.secondaryKeywords.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No secondary keywords</span>
                  )}
                </div>
              </div>
            </div>

            {/* Strategic Metadata: Page Type, Intent, Reason */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Recommended Page Type</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">
                    {cluster.recommendedPageType}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Search Intent</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">
                    {cluster.searchIntent}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Why Grouped Together</span>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed mt-0.5">
                  {cluster.reasonForGrouping}
                </p>
              </div>
            </div>
          </div>
        ))}

        {filteredClusters.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400">
            No keyword clusters found matching your query.
          </div>
        )}
      </div>

      {/* Edit Cluster Modal */}
      {editingCluster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Edit Cluster: {editingCluster.clusterName}
              </h3>
              <button onClick={() => setEditingCluster(null)} className="text-slate-400 text-lg">×</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Cluster Name
                </label>
                <input
                  type="text"
                  required
                  value={editingCluster.clusterName}
                  onChange={(e) => setEditingCluster({ ...editingCluster, clusterName: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Primary Keyword
                </label>
                <input
                  type="text"
                  required
                  value={editingCluster.primaryKeyword}
                  onChange={(e) => setEditingCluster({ ...editingCluster, primaryKeyword: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Secondary Keywords (comma-separated)
                </label>
                <textarea
                  rows={2}
                  value={editingCluster.secondaryKeywords.join(', ')}
                  onChange={(e) => setEditingCluster({
                    ...editingCluster,
                    secondaryKeywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Page Type
                  </label>
                  <input
                    type="text"
                    value={editingCluster.recommendedPageType}
                    onChange={(e) => setEditingCluster({ ...editingCluster, recommendedPageType: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Confidence
                  </label>
                  <select
                    value={editingCluster.confidence}
                    onChange={(e) => setEditingCluster({ ...editingCluster, confidence: e.target.value as ConfidenceLevel })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Needs review">Needs review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Reason for Grouping
                </label>
                <textarea
                  rows={2}
                  value={editingCluster.reasonForGrouping}
                  onChange={(e) => setEditingCluster({ ...editingCluster, reasonForGrouping: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCluster(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Merge Clusters Modal */}
      {isMergeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Merge className="w-4 h-4 text-blue-500" />
                <span>Merge Two Clusters</span>
              </h3>
              <button onClick={() => setIsMergeModalOpen(false)} className="text-slate-400 text-lg">×</button>
            </div>

            <p className="text-xs text-slate-500">
              Combine all keywords and intent signals from the source cluster into the target cluster.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  1. Select Source Cluster (will be absorbed)
                </label>
                <select
                  value={mergeSourceId}
                  onChange={(e) => setMergeSourceId(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                >
                  <option value="">Select source cluster...</option>
                  {clusters.map(c => (
                    <option key={c.id} value={c.id}>{c.clusterName} ({c.primaryKeyword})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  2. Select Target Cluster (will receive keywords)
                </label>
                <select
                  value={mergeTargetId}
                  onChange={(e) => setMergeTargetId(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                >
                  <option value="">Select target destination cluster...</option>
                  {clusters.filter(c => c.id !== mergeSourceId).map(c => (
                    <option key={c.id} value={c.id}>{c.clusterName} ({c.primaryKeyword})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsMergeModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteMerge}
                disabled={!mergeSourceId || !mergeTargetId}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs disabled:opacity-50"
              >
                Execute Merge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Cluster Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Create New Page-Level Cluster
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 text-lg">×</button>
            </div>

            <form onSubmit={handleCreateCluster} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Cluster Name *
                </label>
                <input
                  type="text"
                  required
                  value={newClusterName}
                  onChange={(e) => setNewClusterName(e.target.value)}
                  placeholder="e.g. Rome Colosseum Private Tours Hub"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Primary Keyword *
                </label>
                <input
                  type="text"
                  required
                  value={newPrimaryKw}
                  onChange={(e) => setNewPrimaryKw(e.target.value)}
                  placeholder="e.g. colosseum private tour rome"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Secondary Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={newSecondaries}
                  onChange={(e) => setNewSecondaries(e.target.value)}
                  placeholder="e.g. vatican and colosseum private guide, colosseum skip the line private"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Core Topic
                  </label>
                  <input
                    type="text"
                    value={newCoreTopic}
                    onChange={(e) => setNewCoreTopic(e.target.value)}
                    placeholder="e.g. Rome Tours"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Page Type
                  </label>
                  <input
                    type="text"
                    value={newPageType}
                    onChange={(e) => setNewPageType(e.target.value)}
                    placeholder="e.g. Tour category"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Reason for Page-Level Grouping
                </label>
                <textarea
                  rows={2}
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="Explain why these search phrases can be satisfied on a single landing page..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
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
                  Create Cluster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
