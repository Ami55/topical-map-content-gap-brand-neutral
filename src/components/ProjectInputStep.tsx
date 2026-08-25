import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Building2, 
  Globe2, 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  Edit3, 
  HelpCircle, 
  Compass, 
  ArrowRight,
  Info,
  Layers
} from 'lucide-react';
import { ProjectInput, BusinessProfile } from '../types';
import { PRESETS } from '../data/presets';

interface ProjectInputStepProps {
  input: ProjectInput;
  onChangeInput: (newInput: ProjectInput) => void;
  businessProfile: BusinessProfile | null;
  onChangeBusinessProfile: (newProfile: BusinessProfile) => void;
  onRunResearch: () => void;
  isLoading: boolean;
  onProceedToOverview: () => void;
}

export const ProjectInputStep: React.FC<ProjectInputStepProps> = ({
  input,
  onChangeInput,
  businessProfile,
  onChangeBusinessProfile,
  onRunResearch,
  isLoading,
  onProceedToOverview,
}) => {
  const [newCompetitor, setNewCompetitor] = useState('');
  const [competitorError, setCompetitorError] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);

  // Business profile tag editing state
  const [newProduct, setNewProduct] = useState('');
  const [newProblem, setNewProblem] = useState('');
  const [newCommercialTopic, setNewCommercialTopic] = useState('');
  const [newInformationalTopic, setNewInformationalTopic] = useState('');
  const [newLocationTopic, setNewLocationTopic] = useState('');
  const [newOutsideScopeTopic, setNewOutsideScopeTopic] = useState('');

  const handleApplyPreset = (presetKey: string) => {
    const preset = PRESETS[presetKey];
    if (preset) {
      onChangeInput({ ...preset.input });
    }
  };

  const handleAddCompetitor = () => {
    if (!newCompetitor.trim()) return;
    if (input.competitorDomains.length >= 10) {
      setCompetitorError('Maximum of 10 competitor domains allowed.');
      return;
    }
    let formatted = newCompetitor.trim();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = 'https://' + formatted;
    }
    if (input.competitorDomains.includes(formatted)) {
      setCompetitorError('Competitor already added.');
      return;
    }
    onChangeInput({
      ...input,
      competitorDomains: [...input.competitorDomains, formatted]
    });
    setNewCompetitor('');
    setCompetitorError('');
  };

  const handleRemoveCompetitor = (index: number) => {
    const updated = input.competitorDomains.filter((_, i) => i !== index);
    onChangeInput({ ...input, competitorDomains: updated });
  };

  // Tag list helper
  const renderTagList = (
    title: string,
    items: string[],
    onAdd: (text: string) => void,
    onRemove: (idx: number) => void,
    newVal: string,
    setNewVal: (val: string) => void,
    placeholder: string,
    tagColor = 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
  ) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{title}</label>
        <span className="text-[11px] text-slate-500">({items.length})</span>
      </div>
      <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800">
        {items.map((item, idx) => (
          <span
            key={idx}
            className={`inline-flex items-center text-xs px-2.5 py-1 rounded-md border font-medium ${tagColor}`}
          >
            <span>{item}</span>
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="ml-1.5 text-slate-400 hover:text-red-500 focus:outline-none"
              title="Remove item"
            >
              ×
            </button>
          </span>
        ))}
        {items.length === 0 && (
          <span className="text-xs text-slate-400 italic self-center">None specified</span>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newVal}
          onChange={(e) => setNewVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (newVal.trim()) {
                onAdd(newVal.trim());
                setNewVal('');
              }
            }
          }}
          placeholder={placeholder}
          className="flex-1 text-xs px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => {
            if (newVal.trim()) {
              onAdd(newVal.trim());
              setNewVal('');
            }
          }}
          className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md text-xs font-medium"
        >
          Add
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-2xl border border-slate-800 p-6 text-white shadow-xl">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Semantic SEO Architecture & Market Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Topical Map & Content Gap Finder
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Start from your business model, services, and domain. We analyze your website inventory, research competitor topics, semantically group page-level search intents, discover missing commercial and informational pages, and produce an actionable topical map.
          </p>
        </div>

        {/* Preset Quick Loader */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Sample Presets:
          </span>
          {Object.entries(PRESETS).map(([key, p]) => (
            <button
              key={key}
              type="button"
              id={`preset-btn-${key}`}
              onClick={() => handleApplyPreset(key)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white transition shadow-sm font-medium flex items-center space-x-1.5"
            >
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Step 1 Project Form + Step 2 Business Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* STEP 1: PROJECT INPUT FORM */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                  1
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Step 1: Project & Market Details
                </h2>
              </div>
              <span className="text-xs text-slate-500">All fields adapt AI discovery</span>
            </div>

            <div className="mt-6 space-y-4">
              {/* Project Name & Industry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    id="input-project-name"
                    value={input.projectName}
                    onChange={(e) => onChangeInput({ ...input, projectName: e.target.value })}
                    placeholder="e.g. Global Travel SEO Project"
                    className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Industry *
                  </label>
                  <input
                    type="text"
                    id="input-industry"
                    value={input.industry}
                    onChange={(e) => onChangeInput({ ...input, industry: e.target.value })}
                    placeholder="e.g. Travel & Tourism / Private Guiding"
                    className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Business Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Business Description *
                </label>
                <textarea
                  rows={2}
                  id="input-business-description"
                  value={input.businessDescription}
                  onChange={(e) => onChangeInput({ ...input, businessDescription: e.target.value })}
                  placeholder="Describe your business model and value proposition..."
                  className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Products or Services */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Products & Services *
                </label>
                <textarea
                  rows={2}
                  id="input-products-services"
                  value={input.productsServices}
                  onChange={(e) => onChangeInput({ ...input, productsServices: e.target.value })}
                  placeholder="e.g. Private walking tours, food tours, shore excursions, local guide bookings..."
                  className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Target Audience *
                </label>
                <input
                  type="text"
                  id="input-target-audience"
                  value={input.targetAudience}
                  onChange={(e) => onChangeInput({ ...input, targetAudience: e.target.value })}
                  placeholder="e.g. Travellers seeking personalized, authentic local experiences"
                  className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Country & Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Target Country
                  </label>
                  <input
                    type="text"
                    id="input-target-country"
                    value={input.targetCountry}
                    onChange={(e) => onChangeInput({ ...input, targetCountry: e.target.value })}
                    placeholder="e.g. United States, Global"
                    className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Target Language
                  </label>
                  <input
                    type="text"
                    id="input-target-language"
                    value={input.targetLanguage}
                    onChange={(e) => onChangeInput({ ...input, targetLanguage: e.target.value })}
                    placeholder="e.g. English"
                    className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Website Domain */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Website Domain *
                </label>
                <div className="relative">
                  <Globe2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    id="input-website-domain"
                    value={input.websiteDomain}
                    onChange={(e) => onChangeInput({ ...input, websiteDomain: e.target.value })}
                    placeholder="https://www.example.com"
                    className="w-full text-sm pl-9 pr-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Competitor Domains (Up to 10) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Competitor Domains ({input.competitorDomains.length}/10)
                  </label>
                  <span className="text-[11px] text-slate-500">Up to 10 competitors</span>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="input-competitor-add"
                      value={newCompetitor}
                      onChange={(e) => {
                        setNewCompetitor(e.target.value);
                        setCompetitorError('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCompetitor();
                        }
                      }}
                      placeholder="e.g. https://www.viator.com"
                      className="flex-1 text-sm px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      id="btn-add-competitor"
                      onClick={handleAddCompetitor}
                      disabled={input.competitorDomains.length >= 10}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition disabled:opacity-50 flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>

                  {competitorError && (
                    <p className="text-xs text-red-500">{competitorError}</p>
                  )}

                  {/* Competitors List Chips */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {input.competitorDomains.map((comp, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center text-xs font-mono px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                      >
                        <span className="truncate max-w-[200px]">{comp}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCompetitor(idx)}
                          className="ml-2 text-slate-400 hover:text-red-500 focus:outline-none"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {input.competitorDomains.length === 0 && (
                      <p className="text-xs text-slate-400 italic">No competitors added yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Target Cities & Geographic Hubs (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Target Cities & Geographic Hubs <span className="text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <span className="text-[11px] text-slate-500">{(input.targetCities || []).length} selected</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    'Rome', 'Paris', 'Tokyo', 'Florence', 'Venice', 'Barcelona', 
                    'London', 'Kyoto', 'Amsterdam', 'Athens', 'Montreal', 'Civitavecchia', 
                    'New York City', 'Edinburgh', 'Naples', 'San Francisco', 'Vienna'
                  ].map((city) => {
                    const isSelected = (input.targetCities || []).includes(city);
                    return (
                      <button
                        type="button"
                        key={city}
                        onClick={() => {
                          const current = input.targetCities || [];
                          const updated = isSelected 
                            ? current.filter(c => c !== city)
                            : [...current, city];
                          onChangeInput({ ...input, targetCities: updated });
                        }}
                        className={`text-xs px-2.5 py-1 rounded-md font-medium transition ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{city}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Seed Topics (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Seed Topics <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  id="input-seed-topics"
                  value={input.seedTopics || ''}
                  onChange={(e) => onChangeInput({ ...input, seedTopics: e.target.value })}
                  placeholder="e.g. Rome private tours, Shore excursions Civitavecchia, Food tours Paris"
                  className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* PRIMARY ACTION BUTTON */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  id="btn-research-market"
                  onClick={onRunResearch}
                  disabled={isLoading || !input.websiteDomain || !input.businessDescription}
                  className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      <span>Researching market & generating topical intelligence...</span>
                    </>
                  ) : (
                    <>
                      <Compass className="w-4 h-4" />
                      <span>Research my market</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-slate-500 mt-2">
                  Executes business semantic analysis, website crawl, competitor benchmarking & topical mapping.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 2: UNDERSTAND THE BUSINESS (Business Profile Review & Editor) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs">
                  2
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Step 2: Business Profile
                </h2>
              </div>
              {businessProfile && (
                <span className="inline-flex items-center text-[11px] px-2 py-0.5 rounded font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-4 leading-relaxed">
              Before discovering keywords, reviewing this profile ensures the application filters out irrelevant search terms and focuses strictly on high-intent topics.
            </p>

            {businessProfile ? (
              <div className="space-y-4">
                {/* Core Entity */}
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                    Core Business Entity
                  </label>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {businessProfile.coreBusinessEntity}
                  </p>
                </div>

                {/* Primary Audience */}
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                    Primary Audience
                  </label>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    {businessProfile.primaryAudience}
                  </p>
                </div>

                {/* Main Products / Services */}
                {renderTagList(
                  'Main Products & Services',
                  businessProfile.mainProductsServices,
                  (text) => onChangeBusinessProfile({ ...businessProfile, mainProductsServices: [...businessProfile.mainProductsServices, text] }),
                  (idx) => onChangeBusinessProfile({ ...businessProfile, mainProductsServices: businessProfile.mainProductsServices.filter((_, i) => i !== idx) }),
                  newProduct,
                  setNewProduct,
                  'Add product or service...'
                )}

                {/* Customer Pain Points */}
                {renderTagList(
                  'Customer Problems & Pain Points',
                  businessProfile.customerProblems,
                  (text) => onChangeBusinessProfile({ ...businessProfile, customerProblems: [...businessProfile.customerProblems, text] }),
                  (idx) => onChangeBusinessProfile({ ...businessProfile, customerProblems: businessProfile.customerProblems.filter((_, i) => i !== idx) }),
                  newProblem,
                  setNewProblem,
                  'Add customer problem...'
                )}

                {/* Customer Journey Breakdown */}
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Customer Journey Stages
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="font-semibold text-blue-600 dark:text-blue-400 block mb-1">Awareness</span>
                      <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                        {businessProfile.customerJourney.awareness.slice(0, 3).map((item, i) => (
                          <li key={i} className="truncate">{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="font-semibold text-amber-600 dark:text-amber-400 block mb-1">Consideration</span>
                      <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                        {businessProfile.customerJourney.consideration.slice(0, 3).map((item, i) => (
                          <li key={i} className="truncate">{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">Decision</span>
                      <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                        {businessProfile.customerJourney.decision.slice(0, 3).map((item, i) => (
                          <li key={i} className="truncate">{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="font-semibold text-purple-600 dark:text-purple-400 block mb-1">Retention</span>
                      <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                        {businessProfile.customerJourney.retention.slice(0, 3).map((item, i) => (
                          <li key={i} className="truncate">{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Commercial Topics */}
                {renderTagList(
                  'Commercial Topics',
                  businessProfile.commercialTopics,
                  (text) => onChangeBusinessProfile({ ...businessProfile, commercialTopics: [...businessProfile.commercialTopics, text] }),
                  (idx) => onChangeBusinessProfile({ ...businessProfile, commercialTopics: businessProfile.commercialTopics.filter((_, i) => i !== idx) }),
                  newCommercialTopic,
                  setNewCommercialTopic,
                  'Add commercial topic...',
                  'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                )}

                {/* Informational Topics */}
                {renderTagList(
                  'Informational Topics',
                  businessProfile.informationalTopics,
                  (text) => onChangeBusinessProfile({ ...businessProfile, informationalTopics: [...businessProfile.informationalTopics, text] }),
                  (idx) => onChangeBusinessProfile({ ...businessProfile, informationalTopics: businessProfile.informationalTopics.filter((_, i) => i !== idx) }),
                  newInformationalTopic,
                  setNewInformationalTopic,
                  'Add informational topic...',
                  'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                )}

                {/* Location Topics */}
                {renderTagList(
                  'Location & Destination Topics',
                  businessProfile.locationRelatedTopics,
                  (text) => onChangeBusinessProfile({ ...businessProfile, locationRelatedTopics: [...businessProfile.locationRelatedTopics, text] }),
                  (idx) => onChangeBusinessProfile({ ...businessProfile, locationRelatedTopics: businessProfile.locationRelatedTopics.filter((_, i) => i !== idx) }),
                  newLocationTopic,
                  setNewLocationTopic,
                  'Add location topic...'
                )}

                {/* Outside Scope / Anti-Topics */}
                {renderTagList(
                  'Outside Business Scope (Anti-Topics)',
                  businessProfile.outsideScopeTopics,
                  (text) => onChangeBusinessProfile({ ...businessProfile, outsideScopeTopics: [...businessProfile.outsideScopeTopics, text] }),
                  (idx) => onChangeBusinessProfile({ ...businessProfile, outsideScopeTopics: businessProfile.outsideScopeTopics.filter((_, i) => i !== idx) }),
                  newOutsideScopeTopic,
                  setNewOutsideScopeTopic,
                  'Add negative topic to ignore...',
                  'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                )}

                {/* Navigation CTA */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onProceedToOverview}
                    className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition"
                  >
                    <span>View Market Overview & Architecture</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 px-4 text-center rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800">
                <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Profile will be generated on research
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                  Click "Research my market" on the left to analyze the business entity, customer journey, and commercial vs informational scopes.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
