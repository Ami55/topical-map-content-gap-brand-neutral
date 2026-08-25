import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit, 
  Layers, 
  Tag, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  FolderTree,
  ChevronDown,
  Globe,
  Sparkles,
  MapPin,
  Compass
} from 'lucide-react';
import { 
  KeywordItem, 
  SearchIntent, 
  JourneyStage, 
  BusinessRelevance, 
  QueryPattern, 
  KeywordCluster 
} from '../types';
import { exportKeywordsCsv } from '../lib/csvExport';
import { GLOBAL_CITY_PACKS, generateKeywordsForCity } from '../data/presets';

interface KeywordsViewProps {
  keywords: KeywordItem[];
  clusters: KeywordCluster[];
  onAddKeyword: (kw: KeywordItem) => void;
  onAddMultipleKeywords?: (kws: KeywordItem[], label?: string) => void;
  onUpdateKeyword: (kw: KeywordItem) => void;
  onDeleteKeyword: (id: string) => void;
  onBatchRemoveIrrelevant: () => void;
  projectName: string;
}

export const KeywordsView: React.FC<KeywordsViewProps> = ({
  keywords,
  clusters,
  onAddKeyword,
  onAddMultipleKeywords,
  onUpdateKeyword,
  onDeleteKeyword,
  onBatchRemoveIrrelevant,
  projectName,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedIntent, setSelectedIntent] = useState<string>('all');
  const [selectedJourney, setSelectedJourney] = useState<string>('all');
  const [selectedRelevance, setSelectedRelevance] = useState<string>('all');
  const [selectedPattern, setSelectedPattern] = useState<string>('all');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('all');
  const [showRemoved, setShowRemoved] = useState(false);
  const [isCityExplorerOpen, setIsCityExplorerOpen] = useState(false);
  const [customCityInput, setCustomCityInput] = useState('');

  // New Keyword Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newKwText, setNewKwText] = useState('');
  const [newKwTopic, setNewKwTopic] = useState('');
  const [newKwSubtopic, setNewKwSubtopic] = useState('');
  const [newKwIntent, setNewKwIntent] = useState<SearchIntent>('Commercial investigation');
  const [newKwJourney, setNewKwJourney] = useState<JourneyStage>('Consideration');
  const [newKwPageType, setNewKwPageType] = useState('Tour category');
  const [newKwRelevance, setNewKwRelevance] = useState<BusinessRelevance>('Strongly relevant');
  const [newKwPattern, setNewKwPattern] = useState<QueryPattern>('Service');

  // Filter topics
  const uniqueTopics = useMemo(() => {
    const topics = new Set<string>();
    keywords.forEach(k => {
      if (k.coreTopic) topics.add(k.coreTopic);
    });
    return Array.from(topics).sort();
  }, [keywords]);

  // Extract all unique cities/locations represented in keywords
  const uniqueCities = useMemo(() => {
    const cities = new Set<string>();
    keywords.forEach(k => {
      if (k.location && k.location.trim()) {
        cities.add(k.location.trim());
      }
    });
    return Array.from(cities).sort();
  }, [keywords]);

  // Filtered keywords
  const filteredKeywords = useMemo(() => {
    return keywords.filter(k => {
      if (!showRemoved && k.isRemoved) return false;
      if (showRemoved && !k.isRemoved) return false;

      // City filter
      if (selectedCityFilter !== 'all') {
        const matchesLoc = k.location && k.location.toLowerCase().includes(selectedCityFilter.toLowerCase());
        const matchesTopic = k.coreTopic && k.coreTopic.toLowerCase().includes(selectedCityFilter.toLowerCase());
        const matchesKw = k.keyword.toLowerCase().includes(selectedCityFilter.toLowerCase());
        if (!matchesLoc && !matchesTopic && !matchesKw) return false;
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesTerm = 
          k.keyword.toLowerCase().includes(term) ||
          k.coreTopic.toLowerCase().includes(term) ||
          k.subtopic.toLowerCase().includes(term) ||
          k.mainEntity.toLowerCase().includes(term) ||
          (k.location && k.location.toLowerCase().includes(term));
        if (!matchesTerm) return false;
      }

      if (selectedTopic !== 'all' && k.coreTopic !== selectedTopic) return false;
      if (selectedIntent !== 'all' && k.searchIntent !== selectedIntent) return false;
      if (selectedJourney !== 'all' && k.journeyStage !== selectedJourney) return false;
      if (selectedRelevance !== 'all' && k.businessRelevance !== selectedRelevance) return false;
      if (selectedPattern !== 'all' && k.queryPattern !== selectedPattern) return false;

      return true;
    });
  }, [keywords, showRemoved, selectedCityFilter, searchTerm, selectedTopic, selectedIntent, selectedJourney, selectedRelevance, selectedPattern]);

  const handleCreateKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKwText.trim()) return;

    const newKeyword: KeywordItem = {
      id: `kw_user_${Date.now()}`,
      keyword: newKwText.trim(),
      coreTopic: newKwTopic.trim() || 'General Opportunity',
      subtopic: newKwSubtopic.trim() || 'General',
      mainEntity: newKwTopic.trim() || newKwText.trim(),
      searchIntent: newKwIntent,
      journeyStage: newKwJourney,
      pageType: newKwPageType.trim() || 'Category page',
      businessRelevance: newKwRelevance,
      commercialValue: 'High',
      queryPattern: newKwPattern,
      source: 'seed',
      searchVolume: 'Data unavailable',
      keywordDifficulty: 'Data unavailable',
      cpc: 'Data unavailable'
    };

    onAddKeyword(newKeyword);
    setIsAddModalOpen(false);
    setNewKwText('');
    setNewKwTopic('');
    setNewKwSubtopic('');
  };

  const handleAddCityKeywords = (cityName: string) => {
    if (!cityName.trim()) return;
    const newKws = generateKeywordsForCity(cityName.trim());
    if (onAddMultipleKeywords) {
      onAddMultipleKeywords(newKws, cityName.trim());
    } else {
      newKws.forEach(k => onAddKeyword(k));
    }
    setCustomCityInput('');
  };

  const handleAddPack = (pack: { name: string; cities: string[] }) => {
    let allNewKws: KeywordItem[] = [];
    pack.cities.forEach(city => {
      allNewKws = allNewKws.concat(generateKeywordsForCity(city));
    });
    if (onAddMultipleKeywords) {
      onAddMultipleKeywords(allNewKws, pack.name);
    } else {
      allNewKws.forEach(k => onAddKeyword(k));
    }
  };

  const getRelevanceBadge = (rel: BusinessRelevance) => {
    switch (rel) {
      case 'Essential':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Strongly relevant':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Relevant':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
      case 'Weakly relevant':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Irrelevant':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    }
  };

  const getIntentBadge = (intent: SearchIntent) => {
    switch (intent) {
      case 'Transactional':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Commercial investigation':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'Informational':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'Navigational':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Local':
        return 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-emerald-500" />
            <span>Keyword Opportunity Inventory</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Showing {filteredKeywords.length} of {keywords.length} total discovered search phrases across {uniqueCities.length} destination markets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsCityExplorerOpen(!isCityExplorerOpen)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-sm transition flex items-center space-x-1.5 ${
              isCityExplorerOpen
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isCityExplorerOpen ? 'Hide Destination Expander' : 'Explore & Add Cities'}</span>
          </button>

          <button
            onClick={() => onBatchRemoveIrrelevant()}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 transition"
          >
            Clean Irrelevant
          </button>

          <button
            onClick={() => exportKeywordsCsv(keywords, projectName)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Keyword</span>
          </button>
        </div>
      </div>

      {/* Expandable City & Region Expansion Drawer */}
      {isCityExplorerOpen && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white p-6 rounded-xl border border-blue-800/40 shadow-xl space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-base text-slate-100">Global Destination & Keyword Packs</h3>
            </div>
            <p className="text-xs text-slate-400">
              Expand your topical footprint by generating high-intent keyword opportunities for new cities in 1-click.
            </p>
          </div>

          {/* Quick Packs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {GLOBAL_CITY_PACKS.map((pack) => (
              <div 
                key={pack.name} 
                className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-3.5 flex flex-col justify-between space-y-3 hover:border-blue-500/50 transition"
              >
                <div>
                  <div className="flex items-center space-x-2 text-sm font-semibold text-slate-200">
                    <span className="text-lg">{pack.icon}</span>
                    <span>{pack.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {pack.cities.slice(0, 7).map(c => (
                      <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                        {c}
                      </span>
                    ))}
                    {pack.cities.length > 7 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400">
                        +{pack.cities.length - 7} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                  <span className="text-[11px] text-slate-400 font-medium">{pack.cities.length} cities ({pack.cities.length * 7} kws)</span>
                  <button
                    onClick={() => handleAddPack(pack)}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-500 text-white transition flex items-center space-x-1 shadow"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Pack (+{pack.cities.length * 7})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Custom City Input */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-xs font-semibold text-slate-200">Add Keywords for Any Custom City / Destination</div>
                <div className="text-[11px] text-slate-400">Type any city name (e.g. "Berlin", "Dubai", "Vienna", "Singapore", "Sydney")</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <input
                type="text"
                value={customCityInput}
                onChange={(e) => setCustomCityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customCityInput.trim()) {
                    handleAddCityKeywords(customCityInput.trim());
                  }
                }}
                placeholder="e.g. Vienna, Austria"
                className="w-full sm:w-64 px-3 py-1.5 text-xs rounded-lg border border-slate-600 bg-slate-900 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleAddCityKeywords(customCityInput)}
                disabled={!customCityInput.trim()}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition whitespace-nowrap flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Generate 7+ KWs</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick City Filter Pills */}
      {uniqueCities.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1 flex-shrink-0">
            <Compass className="w-3.5 h-3.5 text-emerald-500" />
            <span>Filter City:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 overflow-x-auto w-full">
            <button
              onClick={() => setSelectedCityFilter('all')}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${
                selectedCityFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Destinations ({keywords.length})
            </button>
            {uniqueCities.map(city => {
              const count = keywords.filter(k => 
                (k.location && k.location.toLowerCase().includes(city.toLowerCase())) ||
                k.coreTopic.toLowerCase().includes(city.toLowerCase()) ||
                k.keyword.toLowerCase().includes(city.toLowerCase())
              ).length;
              return (
                <button
                  key={city}
                  onClick={() => setSelectedCityFilter(city)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${
                    selectedCityFilter === city
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {city} <span className="opacity-70 text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search keywords, topics, subtopics, destinations..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowRemoved(!showRemoved)}
              className={`px-3 py-2 text-xs rounded-lg border font-medium transition ${
                showRemoved 
                  ? 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300' 
                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {showRemoved ? 'Viewing Removed Trash' : 'Active Keywords'}
            </button>
          </div>
        </div>

        {/* Multi-Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Topic */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Core Topic</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full py-1.5 px-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs"
            >
              <option value="all">All Topics ({uniqueTopics.length})</option>
              {uniqueTopics.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Search Intent */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Search Intent</label>
            <select
              value={selectedIntent}
              onChange={(e) => setSelectedIntent(e.target.value)}
              className="w-full py-1.5 px-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs"
            >
              <option value="all">All Intents</option>
              <option value="Informational">Informational</option>
              <option value="Commercial investigation">Commercial investigation</option>
              <option value="Transactional">Transactional</option>
              <option value="Navigational">Navigational</option>
              <option value="Local">Local</option>
            </select>
          </div>

          {/* Journey Stage */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Journey Stage</label>
            <select
              value={selectedJourney}
              onChange={(e) => setSelectedJourney(e.target.value)}
              className="w-full py-1.5 px-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs"
            >
              <option value="all">All Stages</option>
              <option value="Awareness">Awareness</option>
              <option value="Consideration">Consideration</option>
              <option value="Decision">Decision</option>
              <option value="Retention">Retention</option>
            </select>
          </div>

          {/* Relevance */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Business Relevance</label>
            <select
              value={selectedRelevance}
              onChange={(e) => setSelectedRelevance(e.target.value)}
              className="w-full py-1.5 px-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs"
            >
              <option value="all">All Relevance Levels</option>
              <option value="Essential">Essential</option>
              <option value="Strongly relevant">Strongly relevant</option>
              <option value="Relevant">Relevant</option>
              <option value="Weakly relevant">Weakly relevant</option>
              <option value="Irrelevant">Irrelevant</option>
            </select>
          </div>

          {/* Pattern */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Query Pattern</label>
            <select
              value={selectedPattern}
              onChange={(e) => setSelectedPattern(e.target.value)}
              className="w-full py-1.5 px-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs"
            >
              <option value="all">All Query Patterns</option>
              <option value="Service">Service</option>
              <option value="Product">Product</option>
              <option value="Best">Best / Top</option>
              <option value="Cost">Cost / Price</option>
              <option value="Location">Location / City</option>
              <option value="Comparison">Comparison vs</option>
              <option value="How-to">How-to Guide</option>
            </select>
          </div>
        </div>
      </div>

      {/* Keywords Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Keyword Opportunity</th>
                <th className="py-3 px-4">Core Topic / Subtopic</th>
                <th className="py-3 px-4">Search Intent</th>
                <th className="py-3 px-4">Journey Stage</th>
                <th className="py-3 px-4">Recommended Page</th>
                <th className="py-3 px-4">Business Relevance</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredKeywords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <p className="text-sm font-medium">No keywords match your current filters.</p>
                    <p className="text-xs text-slate-500 mt-1">Try clearing some filter options or search terms above.</p>
                  </td>
                </tr>
              ) : (
                filteredKeywords.map((kw) => (
                  <tr key={kw.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-900 dark:text-slate-100 font-semibold">{kw.keyword}</span>
                        {kw.location && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-medium">
                            {kw.location}
                          </span>
                        )}
                        {kw.source === 'competitor' && kw.competitorSource && (
                          <span className="text-[9px] px-1 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {kw.competitorSource}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{kw.coreTopic}</div>
                      <div className="text-[10px] text-slate-400">{kw.subtopic}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded border text-[11px] font-medium ${getIntentBadge(kw.searchIntent)}`}>
                        {kw.searchIntent}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]">
                        {kw.journeyStage}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] text-slate-600 dark:text-slate-400">
                        {kw.pageType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded border text-[11px] font-medium ${getRelevanceBadge(kw.businessRelevance)}`}>
                        {kw.businessRelevance}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onDeleteKeyword(kw.id)}
                          title={kw.isRemoved ? 'Restore keyword' : 'Remove keyword'}
                          className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Keyword Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Add Keyword Opportunity</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateKeyword} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Keyword Phrase *
                </label>
                <input
                  type="text"
                  required
                  value={newKwText}
                  onChange={(e) => setNewKwText(e.target.value)}
                  placeholder="e.g. private walking tour montreal"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Core Topic
                  </label>
                  <input
                    type="text"
                    value={newKwTopic}
                    onChange={(e) => setNewKwTopic(e.target.value)}
                    placeholder="e.g. Montreal Tours"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Subtopic
                  </label>
                  <input
                    type="text"
                    value={newKwSubtopic}
                    onChange={(e) => setNewKwSubtopic(e.target.value)}
                    placeholder="e.g. Walking Tours"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Search Intent
                  </label>
                  <select
                    value={newKwIntent}
                    onChange={(e) => setNewKwIntent(e.target.value as SearchIntent)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Commercial investigation">Commercial investigation</option>
                    <option value="Transactional">Transactional</option>
                    <option value="Informational">Informational</option>
                    <option value="Navigational">Navigational</option>
                    <option value="Local">Local</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Customer Journey
                  </label>
                  <select
                    value={newKwJourney}
                    onChange={(e) => setNewKwJourney(e.target.value as JourneyStage)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Awareness">Awareness</option>
                    <option value="Consideration">Consideration</option>
                    <option value="Decision">Decision</option>
                    <option value="Retention">Retention</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Page Type
                  </label>
                  <input
                    type="text"
                    value={newKwPageType}
                    onChange={(e) => setNewKwPageType(e.target.value)}
                    placeholder="e.g. Tour category"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Relevance
                  </label>
                  <select
                    value={newKwRelevance}
                    onChange={(e) => setNewKwRelevance(e.target.value as BusinessRelevance)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Essential">Essential</option>
                    <option value="Strongly relevant">Strongly relevant</option>
                    <option value="Relevant">Relevant</option>
                    <option value="Weakly relevant">Weakly relevant</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm"
                >
                  Add to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
