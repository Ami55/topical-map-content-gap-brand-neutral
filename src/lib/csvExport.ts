import { 
  KeywordItem, 
  KeywordCluster, 
  PageMapping, 
  ContentGap, 
  TopicalMapPage,
  DiscoveredPage 
} from '../types';

function escapeCsvCell(value: any): string {
  if (value === null || value === undefined) return '""';
  const str = Array.isArray(value) ? value.join('; ') : String(value);
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csvContent = rows.map(r => r.map(escapeCsvCell).join(',')).join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 1. Export All Discovered Keywords
export function exportKeywordsCsv(keywords: KeywordItem[], projectName = 'project') {
  const headers = [
    'Keyword ID',
    'Keyword',
    'Core Topic',
    'Subtopic',
    'Main Entity',
    'Search Intent',
    'Customer Journey Stage',
    'Recommended Page Type',
    'Business Relevance',
    'Commercial Value',
    'Query Pattern',
    'Source',
    'Competitor Source',
    'Location',
    'Audience',
    'Search Volume',
    'Keyword Difficulty',
    'CPC'
  ];

  const rows = keywords.map(k => [
    k.id,
    k.keyword,
    k.coreTopic,
    k.subtopic,
    k.mainEntity,
    k.searchIntent,
    k.journeyStage,
    k.pageType,
    k.businessRelevance,
    k.commercialValue,
    k.queryPattern,
    k.source,
    k.competitorSource || 'N/A',
    k.location || 'N/A',
    k.audience || 'N/A',
    k.searchVolume,
    k.keywordDifficulty,
    k.cpc
  ]);

  downloadCsv(`${projectName.toLowerCase().replace(/\s+/g, '-')}-keywords.csv`, [headers, ...rows]);
}

// 2. Export Keyword Categories
export function exportCategoriesCsv(keywords: KeywordItem[], projectName = 'project') {
  const headers = [
    'Core Topic',
    'Subtopic',
    'Main Entity',
    'Search Intent',
    'Journey Stage',
    'Keyword Count',
    'Sample Keywords'
  ];

  // Group by Core Topic & Subtopic
  const groups: Record<string, { coreTopic: string; subtopic: string; entity: string; intent: string; journey: string; keywords: string[] }> = {};

  keywords.forEach(k => {
    const key = `${k.coreTopic}:::${k.subtopic}`;
    if (!groups[key]) {
      groups[key] = {
        coreTopic: k.coreTopic,
        subtopic: k.subtopic,
        entity: k.mainEntity,
        intent: k.searchIntent,
        journey: k.journeyStage,
        keywords: []
      };
    }
    groups[key].keywords.push(k.keyword);
  });

  const rows = Object.values(groups).map(g => [
    g.coreTopic,
    g.subtopic,
    g.entity,
    g.intent,
    g.journey,
    g.keywords.length,
    g.keywords.slice(0, 5).join(' | ')
  ]);

  downloadCsv(`${projectName.toLowerCase().replace(/\s+/g, '-')}-categories.csv`, [headers, ...rows]);
}

// 3. Export Keyword Clusters
export function exportClustersCsv(clusters: KeywordCluster[], projectName = 'project') {
  const headers = [
    'Cluster ID',
    'Cluster Name',
    'Primary Keyword',
    'Secondary Keywords',
    'Core Topic',
    'Subtopic',
    'Search Intent',
    'Recommended Page Type',
    'Customer Journey Stage',
    'Business Relevance',
    'Reason For Grouping',
    'Confidence Level'
  ];

  const rows = clusters.map(c => [
    c.id,
    c.clusterName,
    c.primaryKeyword,
    c.secondaryKeywords.join('; '),
    c.coreTopic,
    c.subtopic,
    c.searchIntent,
    c.recommendedPageType,
    c.journeyStage,
    c.businessRelevance,
    c.reasonForGrouping,
    c.confidence
  ]);

  downloadCsv(`${projectName.toLowerCase().replace(/\s+/g, '-')}-keyword-clusters.csv`, [headers, ...rows]);
}

// 4. Export Keyword-to-Page Mapping (Strictly structured with all required Step 14 columns)
export function exportPageMappingCsv(
  mappings: PageMapping[],
  clusters: KeywordCluster[],
  gaps: ContentGap[],
  projectName = 'project'
) {
  const headers = [
    'Core Topic',
    'Subtopic',
    'Cluster',
    'Primary Keyword',
    'Secondary Keywords',
    'Search Intent',
    'Recommended Page Type',
    'Existing URL',
    'Mapping Strength',
    'Gap Type',
    'Competitors',
    'Recommended Action',
    'Priority',
    'Confidence'
  ];

  const clusterMap = new Map(clusters.map(c => [c.id, c]));
  const gapMap = new Map(gaps.map(g => [g.keywordClusterId || g.id, g]));

  const rows = mappings.map(m => {
    const cluster = clusterMap.get(m.clusterId);
    const gap = gapMap.get(m.clusterId);

    return [
      cluster?.coreTopic || 'General',
      cluster?.subtopic || 'General',
      m.clusterName,
      m.primaryKeyword,
      m.secondaryKeywords.join('; '),
      cluster?.searchIntent || 'Informational',
      cluster?.recommendedPageType || 'Landing Page',
      m.existingUrl || 'None (Missing Page)',
      m.mappingStrength,
      gap?.gapType || (m.mappingStrength === 'No matching page' ? 'Missing page' : 'Covered'),
      gap?.competitorsCovering?.join('; ') || 'N/A',
      m.recommendedAction,
      gap?.priority || (m.mappingStrength === 'No matching page' ? 'High' : 'Medium'),
      cluster?.confidence || 'High'
    ];
  });

  downloadCsv(`${projectName.toLowerCase().replace(/\s+/g, '-')}-keyword-to-page-mapping.csv`, [headers, ...rows]);
}

// 5. Export Content Gaps
export function exportContentGapsCsv(gaps: ContentGap[], projectName = 'project') {
  const headers = [
    'Gap ID',
    'Gap Name',
    'Topic',
    'Related Cluster',
    'Primary Keyword',
    'Gap Type',
    'Priority',
    'Business Relevance',
    'Recommended Page Type',
    'Suggested Action',
    'Competitors Covering',
    'Competitor Example URLs',
    'User Closest Existing Page',
    'Evidence & Proof',
    'Confidence'
  ];

  const rows = gaps.map(g => [
    g.id,
    g.gapName,
    g.topic,
    g.clusterName || 'N/A',
    g.primaryKeyword || 'N/A',
    g.gapType,
    g.priority,
    g.businessRelevance,
    g.recommendedPageType,
    g.suggestedAction,
    g.competitorsCovering.join('; '),
    g.competitorExampleUrls.join('; '),
    g.userClosestExistingPageUrl || 'None',
    g.evidence,
    g.confidence
  ]);

  downloadCsv(`${projectName.toLowerCase().replace(/\s+/g, '-')}-content-gaps.csv`, [headers, ...rows]);
}

// 6. Export Topical Map
export function exportTopicalMapCsv(pages: TopicalMapPage[], projectName = 'project') {
  const headers = [
    'Page ID',
    'Page Name',
    'Page Role',
    'Parent Topic',
    'Primary Keyword',
    'Secondary Keywords',
    'Search Intent',
    'Recommended Page Type',
    'Status',
    'Is Existing',
    'Existing URL',
    'Suggested URL',
    'Competitors Covering',
    'Priority',
    'Recommended Action',
    'Internal Links Count'
  ];

  const rows = pages.map(p => [
    p.id,
    p.pageName,
    p.pageRole,
    p.parentTopic,
    p.primaryKeyword,
    p.secondaryKeywords.join('; '),
    p.searchIntent,
    p.recommendedPageType,
    p.status,
    p.isExisting ? 'Yes' : 'No',
    p.existingUrl || 'N/A',
    p.suggestedUrl,
    p.competitorsCovering.join('; '),
    p.priority,
    p.recommendedAction,
    p.internalLinks.length
  ]);

  downloadCsv(`${projectName.toLowerCase().replace(/\s+/g, '-')}-topical-map.csv`, [headers, ...rows]);
}

// 7. Export Internal Link Recommendations
export function exportInternalLinksCsv(pages: TopicalMapPage[], projectName = 'project') {
  const headers = [
    'Source Page Name',
    'Source URL / Suggested URL',
    'Target Page Name',
    'Target URL',
    'Link Relationship',
    'Suggested Anchor Texts',
    'Reason For Link'
  ];

  const rows: (string | number)[][] = [];

  pages.forEach(source => {
    const sourceUrl = source.existingUrl || source.suggestedUrl;
    source.internalLinks.forEach(link => {
      rows.push([
        source.pageName,
        sourceUrl,
        link.targetPageName,
        link.targetUrl,
        link.linkRelationship,
        link.suggestedAnchorText.join('; '),
        link.reasonForLink
      ]);
    });
  });

  downloadCsv(`${projectName.toLowerCase().replace(/\s+/g, '-')}-internal-links.csv`, [headers, ...rows]);
}

// Master All-In-One Export
export function exportMasterCsv(
  pages: TopicalMapPage[],
  mappings: PageMapping[],
  clusters: KeywordCluster[],
  gaps: ContentGap[],
  projectName = 'project'
) {
  exportPageMappingCsv(mappings, clusters, gaps, `${projectName}-MASTER`);
}
