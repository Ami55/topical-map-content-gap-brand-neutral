import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  Layers, 
  FolderTree, 
  Link2, 
  AlertCircle, 
  Network, 
  FileCode2, 
  Users2, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  Zap, 
  Target, 
  Split, 
  HelpCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { NavTab } from './Navbar';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: NavTab) => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      id: 'project' as NavTab,
      title: 'Business & Semantic Profiling',
      shortTitle: '1. Business Profiling',
      icon: Compass,
      color: 'emerald',
      badge: 'Step 1: Input & Context',
      summary: 'Define your company, industry, value propositions, target audience, and geographic focus.',
      description: 'The engine starts with business context—not raw keyword dumps. It identifies your core commercial offerings, problem-solving angles, target locations, and out-of-scope boundaries to establish a firm semantic footprint.',
      keyPoints: [
        'Understands target audience personas and intent patterns',
        'Defines seed topics and geographic hubs (e.g. Rome, Tokyo, Paris)',
        'Filters out negative/out-of-scope topics to keep research laser-focused'
      ],
      proTip: 'Add specific target cities and competitor domains to enable deep regional cluster discovery.'
    },
    {
      step: 2,
      id: 'overview' as NavTab,
      title: 'Market Overview & Entity Modeling',
      shortTitle: '2. Market Overview',
      icon: Sparkles,
      color: 'blue',
      badge: 'Step 2: Intelligence Brief',
      summary: 'Synthesizes market opportunities, entity structures, and high-level topical health.',
      description: 'Generates a 360-degree executive snapshot showing total addressable topical coverage, content gap metrics, existing page distribution, and priority recommendations.',
      keyPoints: [
        'Core entity and subtopic taxonomy visualization',
        'Instant pipeline progress tracking across all 9 research steps',
        'Quick jump access to site inventory and competitor benchmarks'
      ],
      proTip: 'Review the executive summary to see which stages of the search funnel have the largest opportunity.'
    },
    {
      step: 3,
      id: 'keywords' as NavTab,
      title: 'Multi-Source Keyword Discovery',
      shortTitle: '3. Keyword Discovery',
      icon: Search,
      color: 'teal',
      badge: 'Step 3: Intent & Queries',
      summary: 'Uncovers 80+ high-value search queries classified across 14 query patterns and 4 journey stages.',
      description: 'Extracts real user queries across awareness, consideration, decision, and retention. Each keyword is tagged with search intent, commercial value, geographic entity, and search pattern (How-to, Service, Best, Comparison, etc.).',
      keyPoints: [
        'Explore & Add Cities drawer with 1-click Regional City Packs',
        'Custom on-the-fly destination keyword generator',
        'Filter by search intent, journey stage, commercial value, and city hubs'
      ],
      proTip: 'Use city pills to analyze keyword demand across individual travel hubs or expansion regions.'
    },
    {
      step: 4,
      id: 'categories' as NavTab,
      title: 'Semantic Categorization',
      shortTitle: '4. Categorization',
      icon: Layers,
      color: 'indigo',
      badge: 'Step 4: Taxonomy Structure',
      summary: 'Organizes raw keywords into clear topical themes, entity silos, and user journey stages.',
      description: 'Structures your keyword landscape into clean topical pillars (e.g., City Tours, Day Excursions, Shore Excursions, Traveler Etiquette Guides) to prevent orphan topics and build comprehensive topical authority.',
      keyPoints: [
        'Pillar-to-subtopic hierarchical relationship visualization',
        'Breakdown by customer journey stage and commercial intent',
        'Identifies foundational versus supplemental content themes'
      ],
      proTip: 'Check category distributions to ensure your site is not overly skewed towards low-intent informational queries without commercial paths.'
    },
    {
      step: 5,
      id: 'clusters' as NavTab,
      title: 'Page-Level Keyword Clustering',
      shortTitle: '5. SERP Clustering',
      icon: FolderTree,
      color: 'purple',
      badge: 'Step 5: URL Intent Modeling',
      summary: 'Groups keywords that belong on the exact same page to satisfy identical search intent.',
      description: 'Prevents keyword cannibalization by determining whether queries should share a single landing URL or be divided into distinct URLs. Differentiates primary head terms from supporting secondary search variations.',
      keyPoints: [
        'One-page intent rule: keywords with the same user intent are unified',
        'Merges, splits, and custom cluster editing capabilities',
        'Recommended page archetypes (Destination Hub, Product Detail, Guide, FAQ)'
      ],
      proTip: 'If two keywords answer the exact same question or offer the exact same product, keep them in one cluster.'
    },
    {
      step: 6,
      id: 'mapping' as NavTab,
      title: 'Page-to-Cluster Mapping & Cannibalization',
      shortTitle: '6. Page Mapping',
      icon: Link2,
      color: 'amber',
      badge: 'Step 6: Existing Content Audit',
      summary: 'Audits your current website pages against keyword clusters to flag matches, gaps, and cannibalization.',
      description: 'Maps each keyword cluster against your crawled website pages. Clearly diagnoses whether you have a Strong Match, Partial Match, No Matching Page, or Dangerous Cannibalization where multiple URLs fight for the same intent.',
      keyPoints: [
        'Automated match strength and strategic action recommendations',
        'Flags cannibalization risks with competing URL pairs',
        'Actions: Keep, Optimize, Expand, Merge, or Create New Page'
      ],
      proTip: 'Resolve cannibalization by consolidating weaker URLs or canonicalizing them to the primary pillar page.'
    },
    {
      step: 7,
      id: 'gaps' as NavTab,
      title: 'Content Gap Analysis',
      shortTitle: '7. Content Gaps',
      icon: AlertCircle,
      color: 'rose',
      badge: 'Step 7: Competitor Void Analysis',
      summary: 'Identifies topics your competitors rank for that are missing from your domain.',
      description: 'Pinpoints missing commercial category pages, omitted geographic hubs, and missing top-of-funnel informational guides. Each gap includes concrete evidence, priority scoring, and competitor proof URLs.',
      keyPoints: [
        'Categorized by gap type: Missing Topic, Missing Commercial Coverage, or Supporting Guide',
        'Priority scoring (High / Medium / Low) based on commercial impact',
        '1-click conversion from identified gap to new Topical Map page'
      ],
      proTip: 'Prioritize "Missing Commercial Coverage" gaps first as they provide the most direct revenue impact.'
    },
    {
      step: 8,
      id: 'topical-map' as NavTab,
      title: 'Topical Map & Internal Link Engine',
      shortTitle: '8. Topical Map',
      icon: Network,
      color: 'emerald',
      badge: 'Step 8: Site Architecture Blueprint',
      summary: 'Produces a hierarchically structured site architecture with parent-child internal linking.',
      description: 'The master blueprint of your website SEO authority. Displays Core Topics (Pillars), Subtopics, and Supporting Guides arranged in an intuitive hierarchy with recommended URL structures and suggested anchor text.',
      keyPoints: [
        'Interactive Tree View, Visual Node Graph, and Table views',
        'Structured internal link recommendations with exact anchor text',
        'Complete content briefs with target search intent and primary keywords'
      ],
      proTip: 'Ensure supporting guides always link up to their respective parent commercial hub using descriptive target anchor text.'
    },
    {
      step: 9,
      id: 'export' as NavTab,
      title: 'Export & Execution Roadmap',
      shortTitle: '9. Export & Share',
      icon: ExternalLink,
      color: 'cyan',
      badge: 'Step 9: Workflow Export',
      summary: 'Export your complete topical map, keyword clusters, and gap reports in CSV, JSON, or Markdown.',
      description: 'Seamlessly hand off the research to copywriters, content managers, or development teams. Includes full copy-paste briefs, URL roadmaps, and structured spreadsheets ready for project tracking.',
      keyPoints: [
        '1-click full JSON project backup and restoration',
        'Formatted CSV exports for Topical Map, Content Gaps, and Keywords',
        'Editorial content production briefs with internal linking guidelines'
      ],
      proTip: 'Export the Content Gap CSV to build your editorial content calendar for the upcoming quarter.'
    }
  ];

  const currentStepData = steps.find(s => s.step === activeStep) || steps[0];

  return (
    <div 
      id="modal-how-it-works"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-lg sm:text-xl text-white tracking-tight">
                  How It Works
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-medium border border-emerald-800/60">
                  9-Step Topical Methodology
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                From business discovery to a production-ready topical map and content gap action plan.
              </p>
            </div>
          </div>

          <button
            id="btn-close-how-it-works"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-lg transition"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Workflow Pipeline Overview Bar */}
        <div className="bg-slate-950/60 border-b border-slate-800 px-4 sm:px-6 py-3 overflow-x-auto scrollbar-none">
          <div className="flex items-center space-x-1 sm:space-x-2 min-w-max">
            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = activeStep === s.step;
              return (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(s.step)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{s.shortTitle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Active Step Spotlight Card */}
          <div className="bg-slate-800/40 rounded-xl border border-slate-700/60 p-5 sm:p-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-700/50">
              <div className="flex items-start space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-700/50 flex items-center justify-center shrink-0">
                  <currentStepData.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                      {currentStepData.badge}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400">Step {currentStepData.step} of 9</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-white mt-1">
                    {currentStepData.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                    {currentStepData.summary}
                  </p>
                </div>
              </div>

              {onNavigateTab && (
                <button
                  onClick={() => {
                    onNavigateTab(currentStepData.id);
                    onClose();
                  }}
                  className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition shrink-0"
                >
                  <span>Go to this step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Detailed Description & Breakdown */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-7 space-y-3">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentStepData.description}
                </p>

                <div className="space-y-2 pt-2">
                  <h5 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                    <Target className="w-3.5 h-3.5 text-emerald-400" />
                    <span>What this step accomplishes:</span>
                  </h5>
                  <ul className="space-y-1.5">
                    {currentStepData.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="md:col-span-5 flex flex-col justify-between bg-slate-900/80 rounded-xl p-4 border border-slate-700/50">
                <div>
                  <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-semibold mb-2">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Strategist Pro Tip</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentStepData.proTip}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Navigation</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                      disabled={activeStep === 1}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 disabled:opacity-30"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setActiveStep(prev => Math.min(9, prev + 1))}
                      disabled={activeStep === 9}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 disabled:opacity-30"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Core SEO Pillars of Topical Authority */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Core Principles of Topical Authority
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-slate-800/30 rounded-xl p-3.5 border border-slate-800">
                <div className="flex items-center space-x-2 text-emerald-400 mb-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <h5 className="font-semibold text-xs text-white">1. Entity-First Approach</h5>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Focuses on real-world concepts, entities, and locations rather than disconnected keyword strings.
                </p>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-3.5 border border-slate-800">
                <div className="flex items-center space-x-2 text-blue-400 mb-1.5">
                  <Split className="w-4 h-4" />
                  <h5 className="font-semibold text-xs text-white">2. Anti-Cannibalization</h5>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Ensures only one URL competes for each user intent, merging overlapping queries into single pages.
                </p>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-3.5 border border-slate-800">
                <div className="flex items-center space-x-2 text-purple-400 mb-1.5">
                  <Network className="w-4 h-4" />
                  <h5 className="font-semibold text-xs text-white">3. Hub & Spoke Links</h5>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Structures internal links from informational guides directly up to high-converting commercial hubs.
                </p>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-3.5 border border-slate-800">
                <div className="flex items-center space-x-2 text-rose-400 mb-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <h5 className="font-semibold text-xs text-white">4. Content Gap Arbitrage</h5>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Captures valuable market share by claiming lucrative queries competitors currently dominate.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-slate-300">© 2026 SEO Morning Brief.</span>
            <span>Developed by Ami - SEO Girl. All rights reserved.</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
            >
              Close Guide
            </button>
            {onNavigateTab && (
              <button
                onClick={() => {
                  onNavigateTab('project');
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition flex items-center space-x-1.5 shadow"
              >
                <span>Start Research (Step 1)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
