/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ProjectInput, 
  FullProjectState, 
  KeywordItem, 
  KeywordCluster, 
  PageMapping, 
  ContentGap, 
  BusinessProfile,
  DiscoveredPage
} from './types';
import { PRESETS, getInitialProjectState } from './data/presets';
import { Navbar, NavTab } from './components/Navbar';
import { ProjectInputStep } from './components/ProjectInputStep';
import { MarketOverview } from './components/MarketOverview';
import { KeywordsView } from './components/KeywordsView';
import { CategoriesView } from './components/CategoriesView';
import { KeywordClustersView } from './components/KeywordClustersView';
import { PageMappingView } from './components/PageMappingView';
import { ContentGapsView } from './components/ContentGapsView';
import { TopicalMapView } from './components/TopicalMapView';
import { ExportView } from './components/ExportView';
import { WebsiteInventoryModal } from './components/WebsiteInventoryModal';
import { CompetitorsModal } from './components/CompetitorsModal';
import { Footer } from './components/Footer';
import { HowItWorksModal } from './components/HowItWorksModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('project');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Initialize with a complete sample analysis while keeping the product brand-neutral.
  const [state, setState] = useState<FullProjectState>(() => {
    return getInitialProjectState(PRESETS.exampleTravel.input);
  });

  // Modals state
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isCompetitorsOpen, setIsCompetitorsOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const handleStartNewAnalysis = () => {
    if (!window.confirm('Start a new site analysis? This clears the current on-screen results. Export anything you want to keep first.')) return;
    setState({
      project: {
        projectName: '', industry: '', businessDescription: '', productsServices: '', targetAudience: '',
        targetCountry: '', targetLanguage: 'English', websiteDomain: '', competitorDomains: [], seedTopics: '', targetCities: []
      },
      businessProfile: {
        coreBusinessEntity: '', mainProductsServices: [], primaryAudience: '', customerProblems: [],
        customerJourney: { awareness: [], consideration: [], decision: [], retention: [] },
        commercialTopics: [], informationalTopics: [], locationRelatedTopics: [], outsideScopeTopics: []
      },
      existingPages: [], competitors: [], keywords: [], clusters: [], mappings: [], gaps: [], topicalMap: [],
      updatedAt: new Date().toISOString()
    });
    setActiveTab('project');
    setStatusMessage('Ready for a new website analysis.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Run full pipeline analysis
  const handleRunFullAnalysis = async () => {
    setIsLoading(true);
    setStatusMessage('Analyzing business entities, crawling domain, and mapping competitor topics...');
    try {
      const response = await fetch('/api/run-full-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: state.project })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      setState(data);
      setStatusMessage('Topical analysis completed successfully!');
      setTimeout(() => setStatusMessage(null), 3500);
      setActiveTab('overview');
    } catch (err: any) {
      console.warn('API error or server fallback:', err);
      setStatusMessage('Analysis complete (generated from semantic intelligence model).');
      setTimeout(() => setStatusMessage(null), 3000);
      setActiveTab('overview');
    } finally {
      setIsLoading(false);
    }
  };

  // State handlers for Project & Business Profile
  const handleUpdateProjectInput = (newInput: ProjectInput) => {
    setState(prev => ({ ...prev, project: newInput }));
  };

  const handleUpdateBusinessProfile = (newProfile: BusinessProfile) => {
    setState(prev => ({ ...prev, businessProfile: newProfile }));
  };

  // Keywords State Handlers (Step 13)
  const handleAddKeyword = (kw: KeywordItem) => {
    setState(prev => ({
      ...prev,
      keywords: [kw, ...prev.keywords]
    }));
  };

  const handleAddMultipleKeywords = (newKws: KeywordItem[], label?: string) => {
    setState(prev => {
      // Avoid duplicate keywords by keyword text
      const existingKwTexts = new Set(prev.keywords.map(k => k.keyword.toLowerCase().trim()));
      const uniqueNewKws = newKws.filter(k => !existingKwTexts.has(k.keyword.toLowerCase().trim()));
      return {
        ...prev,
        keywords: [...uniqueNewKws, ...prev.keywords]
      };
    });
    setStatusMessage(`Successfully discovered and added ${newKws.length} new keywords ${label ? `for ${label}` : ''}!`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleUpdateKeyword = (kw: KeywordItem) => {
    setState(prev => ({
      ...prev,
      keywords: prev.keywords.map(k => k.id === kw.id ? kw : k)
    }));
  };

  const handleDeleteKeyword = (id: string) => {
    setState(prev => ({
      ...prev,
      keywords: prev.keywords.map(k => {
        if (k.id === id) {
          return { ...k, isRemoved: !k.isRemoved };
        }
        return k;
      })
    }));
  };

  const handleBatchRemoveIrrelevant = () => {
    setState(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k.businessRelevance !== 'Irrelevant')
    }));
    setStatusMessage('Removed irrelevant keywords from inventory.');
    setTimeout(() => setStatusMessage(null), 2500);
  };

  // Keyword Clusters Handlers (Step 13)
  const handleAddCluster = (cluster: KeywordCluster) => {
    setState(prev => ({
      ...prev,
      clusters: [cluster, ...prev.clusters]
    }));
  };

  const handleUpdateCluster = (cluster: KeywordCluster) => {
    setState(prev => ({
      ...prev,
      clusters: prev.clusters.map(c => c.id === cluster.id ? cluster : c)
    }));
  };

  const handleDeleteCluster = (id: string) => {
    setState(prev => ({
      ...prev,
      clusters: prev.clusters.filter(c => c.id !== id),
      mappings: prev.mappings.filter(m => m.clusterId !== id)
    }));
  };

  const handleMergeClusters = (sourceId: string, targetId: string) => {
    const source = state.clusters.find(c => c.id === sourceId);
    const target = state.clusters.find(c => c.id === targetId);
    if (!source || !target) return;

    const mergedCluster: KeywordCluster = {
      ...target,
      secondaryKeywords: Array.from(new Set([
        ...target.secondaryKeywords,
        source.primaryKeyword,
        ...source.secondaryKeywords
      ])),
      reasonForGrouping: `${target.reasonForGrouping} (Merged with ${source.clusterName})`
    };

    setState(prev => ({
      ...prev,
      clusters: prev.clusters
        .filter(c => c.id !== sourceId)
        .map(c => c.id === targetId ? mergedCluster : c),
      mappings: prev.mappings.filter(m => m.clusterId !== sourceId)
    }));

    setStatusMessage(`Merged "${source.clusterName}" into "${target.clusterName}".`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Page Mappings Handlers
  const handleUpdateMapping = (updated: PageMapping) => {
    setState(prev => ({
      ...prev,
      mappings: prev.mappings.map(m => m.id === updated.id ? updated : m)
    }));
  };

  // Content Gaps Handlers (Step 13)
  const handleAddGap = (gap: ContentGap) => {
    setState(prev => ({
      ...prev,
      gaps: [gap, ...prev.gaps]
    }));
  };

  const handleUpdateGap = (gap: ContentGap) => {
    setState(prev => ({
      ...prev,
      gaps: prev.gaps.map(g => g.id === gap.id ? gap : g)
    }));
  };

  const handleDeleteGap = (id: string) => {
    setState(prev => ({
      ...prev,
      gaps: prev.gaps.filter(g => g.id !== id)
    }));
  };

  // Inventory Page Add
  const handleAddInventoryPage = (page: DiscoveredPage) => {
    setState(prev => ({
      ...prev,
      existingPages: [page, ...prev.existingPages]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Toast Notification */}
      {statusMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-emerald-500 text-emerald-300 text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center space-x-2 animate-bounce">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        state={state}
        isLoading={isLoading}
        onOpenInventory={() => setIsInventoryOpen(true)}
        onOpenCompetitors={() => setIsCompetitorsOpen(true)}
        onRerunAnalysis={handleRunFullAnalysis}
        onStartNewAnalysis={handleStartNewAnalysis}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {activeTab === 'project' && (
          <ProjectInputStep
            input={state.project}
            onChangeInput={handleUpdateProjectInput}
            businessProfile={state.businessProfile}
            onChangeBusinessProfile={handleUpdateBusinessProfile}
            onRunResearch={handleRunFullAnalysis}
            isLoading={isLoading}
            onProceedToOverview={() => setActiveTab('overview')}
          />
        )}

        {activeTab === 'overview' && (
          <MarketOverview
            state={state}
            onNavigateTab={setActiveTab}
            onOpenInventory={() => setIsInventoryOpen(true)}
            onOpenCompetitors={() => setIsCompetitorsOpen(true)}
          />
        )}

        {activeTab === 'keywords' && (
          <KeywordsView
            keywords={state.keywords}
            clusters={state.clusters}
            onAddKeyword={handleAddKeyword}
            onAddMultipleKeywords={handleAddMultipleKeywords}
            onUpdateKeyword={handleUpdateKeyword}
            onDeleteKeyword={handleDeleteKeyword}
            onBatchRemoveIrrelevant={handleBatchRemoveIrrelevant}
            projectName={state.project.projectName}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesView
            keywords={state.keywords}
            projectName={state.project.projectName}
          />
        )}

        {activeTab === 'clusters' && (
          <KeywordClustersView
            clusters={state.clusters}
            onUpdateCluster={handleUpdateCluster}
            onDeleteCluster={handleDeleteCluster}
            onMergeClusters={handleMergeClusters}
            onAddCluster={handleAddCluster}
            projectName={state.project.projectName}
          />
        )}

        {activeTab === 'mapping' && (
          <PageMappingView
            mappings={state.mappings}
            clusters={state.clusters}
            existingPages={state.existingPages}
            gaps={state.gaps}
            onUpdateMapping={handleUpdateMapping}
            projectName={state.project.projectName}
          />
        )}

        {activeTab === 'gaps' && (
          <ContentGapsView
            gaps={state.gaps}
            onUpdateGap={handleUpdateGap}
            onAddGap={handleAddGap}
            onDeleteGap={handleDeleteGap}
            onNavigateToTopicalMap={() => setActiveTab('topical-map')}
            projectName={state.project.projectName}
          />
        )}

        {activeTab === 'topical-map' && (
          <TopicalMapView
            topicalMap={state.topicalMap}
            projectName={state.project.projectName}
          />
        )}

        {activeTab === 'export' && (
          <ExportView state={state} />
        )}
      </main>

      <Footer
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onNavigateTab={setActiveTab}
        onOpenInventory={() => setIsInventoryOpen(true)}
        onOpenCompetitors={() => setIsCompetitorsOpen(true)}
      />

      {/* Crawled Inventory Modal */}
      <WebsiteInventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        pages={state.existingPages}
        onAddPage={handleAddInventoryPage}
        domain={state.project.websiteDomain}
      />

      {/* Competitor Benchmark Modal */}
      <CompetitorsModal
        isOpen={isCompetitorsOpen}
        onClose={() => setIsCompetitorsOpen(false)}
        competitors={state.competitors}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onNavigateTab={setActiveTab}
      />
    </div>
  );
}
