export type SearchIntent = 
  | 'Informational' 
  | 'Commercial investigation' 
  | 'Transactional' 
  | 'Navigational' 
  | 'Local' 
  | 'Mixed';

export type JourneyStage = 'Awareness' | 'Consideration' | 'Decision' | 'Retention';

export type BusinessRelevance = 
  | 'Essential' 
  | 'Strongly relevant' 
  | 'Relevant' 
  | 'Weakly relevant' 
  | 'Irrelevant';

export type CommercialValue = 'High' | 'Medium' | 'Low';

export type QueryPattern = 
  | 'Service' 
  | 'Category' 
  | 'Location' 
  | 'Best' 
  | 'Comparison' 
  | 'Guide' 
  | 'How-to' 
  | 'Question' 
  | 'Pricing' 
  | 'Review' 
  | 'Alternative' 
  | 'Definition' 
  | 'Seasonal' 
  | 'Other';

export type ConfidenceLevel = 'High' | 'Medium' | 'Needs review';

export type MappingStrength = 
  | 'Strong match' 
  | 'Partial match' 
  | 'Weak match' 
  | 'No matching page' 
  | 'Possible cannibalization' 
  | 'Needs review';

export type MappingAction = 
  | 'Keep existing page' 
  | 'Optimize existing page' 
  | 'Expand existing page' 
  | 'Change page targeting' 
  | 'Merge overlapping pages' 
  | 'Create a new page' 
  | 'Add as a section' 
  | 'Add as an FAQ' 
  | 'Do not target' 
  | 'Review manually';

export type GapType = 
  | 'Missing topic' 
  | 'Missing page' 
  | 'Weak existing page' 
  | 'Missing commercial coverage' 
  | 'Missing informational support' 
  | 'Competitor advantage' 
  | 'Customer-journey gap'
  | 'User advantage';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export type PageStatus = 
  | 'Existing and properly mapped' 
  | 'Existing but needs optimization' 
  | 'Existing but weak' 
  | 'Missing page' 
  | 'Possible overlap' 
  | 'Future opportunity';

export type PageRole = 
  | 'Core Topic' 
  | 'Pillar Hub' 
  | 'Commercial Destination' 
  | 'Supporting Guide' 
  | 'FAQ / Micro-Guide' 
  | 'Comparison / Alternative';

export interface ProjectInput {
  projectName: string;
  industry: string;
  businessDescription: string;
  productsServices: string;
  targetAudience: string;
  targetCountry: string;
  targetLanguage: string;
  websiteDomain: string;
  competitorDomains: string[];
  seedTopics?: string;
  targetCities?: string[];
}

export interface BusinessProfile {
  coreBusinessEntity: string;
  mainProductsServices: string[];
  primaryAudience: string;
  customerProblems: string[];
  customerJourney: {
    awareness: string[];
    consideration: string[];
    decision: string[];
    retention: string[];
  };
  commercialTopics: string[];
  informationalTopics: string[];
  locationRelatedTopics: string[];
  outsideScopeTopics: string[];
  notes?: string;
}

export interface DiscoveredPage {
  id: string;
  url: string;
  title: string;
  h1: string;
  metaDescription: string;
  canonicalUrl: string;
  pageType: string;
  mainTopic: string;
  likelySearchIntent: SearchIntent;
  mainEntities: string[];
  parentSection: string;
  indexability: 'Indexable' | 'Noindex' | 'Blocked by robots.txt' | 'Redirect' | 'Error 404/500';
  httpStatus: number;
  source: 'crawl' | 'sitemap' | 'csv' | 'manual';
}

export interface CompetitorAnalysis {
  domain: string;
  importantSections: string[];
  discoveredPagesCount: number;
  samplePages: { url: string; title: string; pageType: string; topic: string }[];
  repeatedTopicPatterns: string[];
  commercialPageTypes: string[];
  informationalPageTypes: string[];
  locationCategoryStructures: string[];
  extractedTopics: string[];
  uniqueTopics: string[];
}

export interface KeywordItem {
  id: string;
  keyword: string;
  coreTopic: string;
  subtopic: string;
  mainEntity: string;
  searchIntent: SearchIntent;
  journeyStage: JourneyStage;
  pageType: string;
  businessRelevance: BusinessRelevance;
  commercialValue: CommercialValue;
  location?: string;
  audience?: string;
  queryPattern: QueryPattern;
  source: 'business_model' | 'existing_website' | 'competitor' | 'autocomplete' | 'related_search' | 'seed';
  competitorSource?: string;
  // Metrics strictly marked as unavailable unless real integration
  searchVolume: 'Data unavailable';
  keywordDifficulty: 'Data unavailable';
  cpc: 'Data unavailable';
  clusterId?: string;
  isRemoved?: boolean;
}

export interface KeywordCluster {
  id: string;
  clusterName: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  coreTopic: string;
  subtopic: string;
  searchIntent: SearchIntent;
  recommendedPageType: string;
  journeyStage: JourneyStage;
  businessRelevance: BusinessRelevance;
  reasonForGrouping: string;
  confidence: ConfidenceLevel;
  notes?: string;
}

export interface PageMapping {
  id: string;
  clusterId: string;
  clusterName: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  existingPageId?: string;
  existingUrl?: string;
  existingPageTitle?: string;
  mappingStrength: MappingStrength;
  matchExplanation: string;
  recommendedAction: MappingAction;
  confidence?: ConfidenceLevel;
  competingPages?: { url: string; title: string }[];
  notes?: string;
}

export interface ContentGap {
  id: string;
  gapName: string;
  topic: string;
  keywordClusterId?: string;
  clusterName?: string;
  primaryKeyword?: string;
  competitorsCovering: string[];
  competitorExampleUrls: string[];
  userClosestExistingPageUrl?: string;
  userClosestExistingPageTitle?: string;
  gapType: GapType;
  businessRelevance: BusinessRelevance;
  recommendedPageType: string;
  suggestedAction: string;
  priority: PriorityLevel;
  evidence: string;
  confidence: ConfidenceLevel;
  isDismissed?: boolean;
  notes?: string;
}

export interface InternalLinkRecommendation {
  sourcePageId: string;
  targetPageId: string;
  targetPageName: string;
  targetUrl: string;
  linkRelationship: 'Parent' | 'Child' | 'Sibling' | 'Commercial Destination' | 'Supporting Guide' | 'Related Topic';
  suggestedAnchorText: string[];
  reasonForLink: string;
}

export interface TopicalMapPage {
  id: string;
  pageName: string;
  pageRole: PageRole;
  parentTopic: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: SearchIntent;
  recommendedPageType: string;
  status: PageStatus;
  isExisting: boolean;
  existingUrl?: string;
  suggestedUrl: string;
  competitorsCovering: string[];
  priority: PriorityLevel;
  recommendedAction: MappingAction;
  clusterId?: string;
  childPageIds?: string[];
  internalLinks: InternalLinkRecommendation[];
  notes?: string;
}

export interface TopicalMapNode {
  id: string;
  name: string;
  role: 'Core Topic' | 'Pillar' | 'Sub-Pillar' | 'Page';
  pageData?: TopicalMapPage;
  children: TopicalMapNode[];
}

export interface FullProjectState {
  project: ProjectInput;
  businessProfile: BusinessProfile;
  existingPages: DiscoveredPage[];
  competitors: CompetitorAnalysis[];
  keywords: KeywordItem[];
  clusters: KeywordCluster[];
  mappings: PageMapping[];
  gaps: ContentGap[];
  topicalMap: TopicalMapPage[];
  updatedAt: string;
}
