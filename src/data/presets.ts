import { 
  ProjectInput, 
  FullProjectState, 
  BusinessProfile, 
  DiscoveredPage, 
  CompetitorAnalysis, 
  KeywordItem, 
  KeywordCluster, 
  PageMapping, 
  ContentGap, 
  TopicalMapPage,
  SearchIntent,
  JourneyStage,
  BusinessRelevance,
  QueryPattern
} from '../types';

export const PRESETS: Record<string, { label: string; description: string; input: ProjectInput }> = {
  exampleTravel: {
    label: 'Example Travel (Fictional Demo)',
    description: 'Private tours & verified local guides marketplace connecting discerning travellers with custom itineraries across 150+ countries.',
    input: {
      projectName: 'Topical Map & Content Gap Analysis',
      industry: 'Travel & Tourism',
      businessDescription: 'A marketplace connecting travellers with private local tour guides across 150+ countries for personalized, flexible itineraries.',
      productsServices: 'Private tours, walking tours, food tours, day trips, shore excursions, museum visits, and verified independent local guides.',
      targetAudience: 'Discerning travellers, couples, multi-generational families, and cruise ship passengers seeking personalized local experiences without large tour buses.',
      targetCountry: 'United States, United Kingdom, Canada, Australia',
      targetLanguage: 'English',
      websiteDomain: 'https://example.com',
      targetCities: ['Rome', 'Paris', 'Tokyo', 'Florence', 'Venice', 'Barcelona', 'London', 'Kyoto', 'Montreal', 'Athens', 'Amsterdam', 'Civitavecchia'],
      competitorDomains: [
        'https://www.viator.com',
        'https://www.getyourguide.com',
        'https://www.tripadvisor.com',
        'https://www.withlocals.com'
      ],
      seedTopics: 'Private tours Rome, Paris food tour, Shore excursions Civitavecchia, Tokyo day trips, Old Montreal walking tours, Florence Uffizi guide, Kyoto temples private tour, Barcelona gothic quarter'
    }
  },
  b2bSaaS: {
    label: 'ProductLogix (B2B SaaS Analytics)',
    description: 'Product analytics, feature flags, and session recording platform for engineering and growth teams.',
    input: {
      projectName: 'ProductLogix SEO Hub',
      industry: 'B2B Software & Developer Tools',
      businessDescription: 'All-in-one product analytics suite combining user behavior tracking, session replay, feature flags, and A/B testing in an open-source or cloud platform.',
      productsServices: 'Product analytics, session replay, automated event capture, feature flags, user surveys, data warehouse sync.',
      targetAudience: 'Product managers, VP Engineering, growth product managers, and data analysts at mid-market to enterprise tech companies.',
      targetCountry: 'United States, Global',
      targetLanguage: 'English',
      websiteDomain: 'https://www.productlogix.io',
      competitorDomains: [
        'https://www.mixpanel.com',
        'https://www.amplitude.com',
        'https://www.posthog.com',
        'https://www.fullstory.com'
      ],
      seedTopics: 'Product analytics tools, session recording vs heatmaps, feature flag management, self-hosted analytics'
    }
  },
  d2cEcommerce: {
    label: 'Restful Sleep (D2C Organic Bedding)',
    description: 'Sustainable organic latex mattresses, linen sheets, and ergonomic pillows for health-conscious sleepers.',
    input: {
      projectName: 'Restful Sleep Topical Authority',
      industry: 'E-commerce & Home Living',
      businessDescription: 'Direct-to-consumer sustainable sleep brand manufacturing non-toxic certified organic latex mattresses, breathable linen sheets, and ergonomic pillows.',
      productsServices: 'Organic latex mattresses, natural linen sheets, adjustable organic latex pillows, mattress toppers, eco-friendly mattress protectors.',
      targetAudience: 'Eco-conscious homeowners, wellness enthusiasts, back pain sufferers, and couples prioritizing non-toxic organic living.',
      targetCountry: 'United States',
      targetLanguage: 'English',
      websiteDomain: 'https://www.restfulsleeporganics.com',
      competitorDomains: [
        'https://www.avocadogreenmattress.com',
        'https://www.birchliving.com',
        'https://www.saatva.com',
        'https://www.brooklinen.com'
      ],
      seedTopics: 'Organic latex mattress reviews, best mattress for back pain, linen sheets vs cotton, non toxic bedding certified'
    }
  }
};

export const GLOBAL_CITY_PACKS: { name: string; icon: string; cities: string[] }[] = [
  {
    name: 'Top European Capitals & Cultural Hubs',
    icon: '🏛️',
    cities: ['Rome', 'Paris', 'Florence', 'Venice', 'Barcelona', 'London', 'Amsterdam', 'Madrid', 'Lisbon', 'Athens', 'Vienna', 'Prague', 'Edinburgh', 'Dublin']
  },
  {
    name: 'Asia-Pacific & Middle East Gems',
    icon: '⛩️',
    cities: ['Tokyo', 'Kyoto', 'Osaka', 'Bangkok', 'Singapore', 'Sydney', 'Dubai', 'Seoul', 'Hiroshima', 'Hong Kong', 'Bali', 'Melbourne']
  },
  {
    name: 'Major Cruise Ports & Shore Excursions',
    icon: '🚢',
    cities: ['Civitavecchia', 'Naples & Amalfi', 'Marseille', 'Dubrovnik', 'Santorini', 'Kusadasi & Ephesus', 'Cozumel', 'Juneau', 'Barcelona Port', 'Piraeus']
  },
  {
    name: 'North America City Escapes',
    icon: '🗽',
    cities: ['New York City', 'Montreal', 'San Francisco', 'Vancouver', 'New Orleans', 'Quebec City', 'Chicago', 'Boston', 'Seattle', 'Washington DC']
  },
  {
    name: 'Wine, Food & Culinary Capitals',
    icon: '🍷',
    cities: ['Bordeaux', 'Tuscany / Florence', 'Paris Le Marais', 'Tokyo Tsukiji', 'Barcelona Tapas', 'San Sebastian', 'Ocho Rios', 'Oaxaca']
  }
];

// Helper to generate a keyword item with consistent structure
function createKeyword(
  id: string,
  keyword: string,
  coreTopic: string,
  subtopic: string,
  mainEntity: string,
  searchIntent: SearchIntent,
  journeyStage: JourneyStage,
  pageType: string,
  businessRelevance: BusinessRelevance,
  queryPattern: QueryPattern,
  location?: string,
  source: 'business_model' | 'autocomplete' | 'competitor' | 'seed' | 'related_search' = 'business_model',
  competitorSource?: string
): KeywordItem {
  return {
    id,
    keyword,
    coreTopic,
    subtopic,
    mainEntity,
    searchIntent,
    journeyStage,
    pageType,
    businessRelevance,
    commercialValue: 'High',
    location,
    queryPattern,
    source,
    competitorSource,
    searchVolume: 'Data unavailable',
    keywordDifficulty: 'Data unavailable',
    cpc: 'Data unavailable'
  };
}

// Generate rich keywords for any city on the fly
export function generateKeywordsForCity(cityName: string, startIndex: number = 100): KeywordItem[] {
  const city = cityName.trim();
  const cId = city.toLowerCase().replace(/[^a-z0-9]/g, '_');
  
  return [
    createKeyword(`kw_${cId}_1`, `private tour guide ${city.toLowerCase()}`, `${city} Tours`, 'Local Guides Hub', `${city} Local Guide`, 'Commercial investigation', 'Consideration', 'Destination Category', 'Essential', 'Service', city, 'business_model'),
    createKeyword(`kw_${cId}_2`, `best private walking tour in ${city.toLowerCase()}`, `${city} Tours`, 'Walking Tours', `${city} Walking Tour`, 'Commercial investigation', 'Consideration', 'Category Sub-Hub', 'Strongly relevant', 'Best', city, 'autocomplete'),
    createKeyword(`kw_${cId}_3`, `hire english speaking guide in ${city.toLowerCase()}`, `${city} Tours`, 'Local Guides Hub', `${city} English Guide`, 'Transactional', 'Decision', 'Commercial Landing Page', 'Essential', 'Service', city, 'seed'),
    createKeyword(`kw_${cId}_4`, `private food and wine tour ${city.toLowerCase()}`, `${city} Tours`, 'Food & Wine Tours', `${city} Food Tour`, 'Transactional', 'Decision', 'Tour detail', 'Strongly relevant', 'Category', city, 'competitor', 'viator.com'),
    createKeyword(`kw_${cId}_5`, `custom day trips from ${city.toLowerCase()} with private driver`, `${city} Tours`, 'Day Excursions', `${city} Day Trip`, 'Commercial investigation', 'Consideration', 'Day Trip Destination Page', 'Strongly relevant', 'Location', city, 'competitor', 'getyourguide.com'),
    createKeyword(`kw_${cId}_6`, `family friendly private tour ${city.toLowerCase()} with kids`, `${city} Tours`, 'Family Travel', `${city} with Kids`, 'Commercial investigation', 'Consideration', 'Category Sub-Hub', 'Relevant', 'Category', city, 'related_search'),
    createKeyword(`kw_${cId}_7`, `private historical landmark tour ${city.toLowerCase()}`, `${city} Tours`, 'Historical Landmarks', `${city} Landmarks`, 'Commercial investigation', 'Consideration', 'Category Sub-Hub', 'Strongly relevant', 'Category', city, 'autocomplete'),
  ];
}

export function getInitialProjectState(input: ProjectInput = PRESETS.exampleTravel.input): FullProjectState {
  const businessProfile: BusinessProfile = {
    coreBusinessEntity: 'Private tour guide marketplace & custom itinerary booking platform',
    mainProductsServices: [
      'Private walking tours with certified local guides',
      'Private food, wine, and culinary tasting tours',
      'Guaranteed on-time private shore excursions for cruise travellers',
      'Custom day trips and scenic excursions with private chauffeured cars',
      'Skip-the-line museum, palace, and historical landmark private tours',
      'Family-friendly and multi-generational custom itineraries'
    ],
    primaryAudience: 'Independent discerning travellers, couples, multi-generational families, luxury travellers, and cruise passengers seeking personalized local experiences without crowded tour buses.',
    customerProblems: [
      'Overcrowded mass group tours with rigid itineraries and loudspeakers',
      'Difficulty finding trustworthy, vetted local guides in foreign cities abroad',
      'Cruises charging inflated rates for generic, impersonal shore excursion buses',
      'Navigating foreign languages, complex museum ticketing queues, and transit systems',
      'Generic guidebooks missing authentic local hidden gems and cultural nuances'
    ],
    customerJourney: {
      awareness: [
        'Best things to do in Rome in 3 days',
        'How do private shore excursions work with cruise schedules',
        'Is a private tour guide worth it in Europe',
        'Top authentic foodie neighbourhoods in Paris and Tokyo'
      ],
      consideration: [
        'Private tour vs group bus tour comparison',
        'Best rated private guides Rome Colosseum & Vatican',
        'Paris food tour reviews and itinerary options',
        'Kyoto historic temples half-day vs full-day private guide'
      ],
      decision: [
        'Book private tour guide Rome Colosseum with skip the line',
        'Civitavecchia to Rome port transfer and private tour price',
        'Hire private English speaking guide in Tokyo with driver',
        'Reserve customized family walking tour in Florence'
      ],
      retention: [
        'How to tip a private tour guide in Europe',
        'Rebook vetted local guides for next city destination',
        'Leave review and share custom photo memories with local host'
      ]
    },
    commercialTopics: [
      'Private walking tours in major world cities',
      'Gourmet private food, pastry, and wine tasting tours',
      'Cruise port shore excursions with back-to-ship guarantee',
      'Historical landmark and skip-the-line museum tours',
      'Private car day trips and countryside excursions',
      'Family-friendly interactive city tours with kids'
    ],
    informationalTopics: [
      'City travel guides, itineraries, and neighbourhood breakdowns',
      'Private vs group tour comparison and cost breakdown',
      'Tipping etiquette and customs for private tour guides abroad',
      'Cruise passenger port timing guides and excursion planning',
      'Tips for booking independent local guides safely'
    ],
    locationRelatedTopics: [
      'Private tours in Rome, Paris, Tokyo, Florence, Venice, Barcelona, London, Kyoto, Montreal, Athens, Amsterdam, New York, Edinburgh',
      'Shore excursions from Civitavecchia, Naples, Marseille, Dubrovnik, Santorini, Piraeus ports',
      'Countryside day trips to Tuscany, Versailles, Mount Fuji, Cotswolds, Montserrat, Pompeii'
    ],
    outsideScopeTopics: [
      'Cheap group bus tickets and hop-on-hop-off bus passes',
      'Commercial airline ticket bookings',
      'Hotel room and hostel reservations',
      'Car rental without driver or guide',
      'Automated self-guided GPS audio apps without real human guides'
    ]
  };

  const existingPages: DiscoveredPage[] = [
    {
      id: 'page_1',
      url: 'https://example.com/',
      title: 'Example Travel - Private Tour Guides Worldwide | Custom Tours',
      h1: 'Connect with Verified Local Guides Worldwide',
      metaDescription: 'Book flexible private tours with local guides in 150+ countries. Custom itineraries, private transportation, and authentic travel experiences.',
      canonicalUrl: 'https://example.com/',
      pageType: 'Homepage',
      mainTopic: 'Private Tours Marketplace',
      likelySearchIntent: 'Navigational',
      mainEntities: ['Private Tours', 'Local Tour Guides', 'Custom Travel Itineraries'],
      parentSection: 'Root',
      indexability: 'Indexable',
      httpStatus: 200,
      source: 'crawl'
    },
    {
      id: 'page_2',
      url: 'https://example.com/Rome-Tours',
      title: 'Private Tours in Rome - Top Rated Local Rome Tour Guides',
      h1: 'Discover Rome With a Private Local Guide',
      metaDescription: 'Explore the Colosseum, Vatican, and hidden alleys with top-rated private local guides in Rome.',
      canonicalUrl: 'https://example.com/Rome-Tours',
      pageType: 'Destination Category',
      mainTopic: 'Rome Private Tours',
      likelySearchIntent: 'Commercial investigation',
      mainEntities: ['Rome', 'Colosseum', 'Vatican City', 'Private Guide Rome'],
      parentSection: 'Italy',
      indexability: 'Indexable',
      httpStatus: 200,
      source: 'crawl'
    },
    {
      id: 'page_3',
      url: 'https://example.com/Paris-Tours',
      title: 'Private Tours in Paris - Custom Paris Itineraries with Local Experts',
      h1: 'Discover Paris With a Private Local Guide',
      metaDescription: 'Personalized walking tours, Louvre tours, and Montmartre walks with expert local Parisians.',
      canonicalUrl: 'https://example.com/Paris-Tours',
      pageType: 'Destination Category',
      mainTopic: 'Paris Tours',
      likelySearchIntent: 'Commercial investigation',
      mainEntities: ['Paris', 'Louvre Museum', 'Eiffel Tower', 'Montmartre'],
      parentSection: 'France',
      indexability: 'Indexable',
      httpStatus: 200,
      source: 'crawl'
    },
    {
      id: 'page_4',
      url: 'https://example.com/Tokyo-Tours',
      title: 'Tokyo Private Tours & Day Trips with English-Speaking Guides',
      h1: 'Custom Tokyo Tours With English-Speaking Local Guides',
      metaDescription: 'Explore Tokyo, Shibuya, Asakusa, and Mt. Fuji day trips with private local guides.',
      canonicalUrl: 'https://example.com/Tokyo-Tours',
      pageType: 'Destination Category',
      mainTopic: 'Tokyo Tours',
      likelySearchIntent: 'Commercial investigation',
      mainEntities: ['Tokyo', 'Shibuya', 'Mt Fuji', 'Private Guide Tokyo'],
      parentSection: 'Japan',
      indexability: 'Indexable',
      httpStatus: 200,
      source: 'crawl'
    },
    {
      id: 'page_5',
      url: 'https://example.com/Florence-Tours',
      title: 'Private Florence Tours - Uffizi & Renaissance Walking Tours',
      h1: 'Experience Renaissance Florence with a Private Local Historian',
      metaDescription: 'Private walking tours in Florence, Uffizi Gallery tours, and Duomo tours with expert art historians.',
      canonicalUrl: 'https://example.com/Florence-Tours',
      pageType: 'Destination Category',
      mainTopic: 'Florence Tours',
      likelySearchIntent: 'Commercial investigation',
      mainEntities: ['Florence', 'Uffizi Gallery', 'Accademia', 'Duomo'],
      parentSection: 'Italy',
      indexability: 'Indexable',
      httpStatus: 200,
      source: 'crawl'
    },
    {
      id: 'page_6',
      url: 'https://example.com/Venice-Tours',
      title: 'Private Tours in Venice - Gondola, St. Marks & Hidden Canals',
      h1: 'Explore Secret Venice with a Local Venetian Guide',
      metaDescription: 'Custom Venice walking tours, St. Marks Basilica skip the line, and lagoon island excursions to Murano.',
      canonicalUrl: 'https://example.com/Venice-Tours',
      pageType: 'Destination Category',
      mainTopic: 'Venice Tours',
      likelySearchIntent: 'Commercial investigation',
      mainEntities: ['Venice', 'St Marks Square', 'Gondola Tour', 'Murano'],
      parentSection: 'Italy',
      indexability: 'Indexable',
      httpStatus: 200,
      source: 'crawl'
    },
    {
      id: 'page_7',
      url: 'https://example.com/Barcelona-Tours',
      title: 'Private Barcelona Tours - Sagrada Familia, Gaudi & Tapas Walks',
      h1: 'Custom Barcelona Private Tours with Local Catalan Guides',
      metaDescription: 'Experience Gaudi architecture, Sagrada Familia private access, and Gothic Quarter culinary walks.',
      canonicalUrl: 'https://example.com/Barcelona-Tours',
      pageType: 'Destination Category',
      mainTopic: 'Barcelona Tours',
      likelySearchIntent: 'Commercial investigation',
      mainEntities: ['Barcelona', 'Sagrada Familia', 'Gothic Quarter', 'Park Guell'],
      parentSection: 'Spain',
      indexability: 'Indexable',
      httpStatus: 200,
      source: 'crawl'
    },
    {
      id: 'page_8',
      url: 'https://example.com/London-Tours',
      title: 'Private London Tours - British Royal History & Hidden Alleys',
      h1: 'Private Guided London Sightseeing with Local Historians',
      metaDescription: 'Discover Westminster Abbey, Tower of London, and quirky London pub walks with certified Blue Badge guides.',
      canonicalUrl: 'https://example.com/London-Tours',
      pageType: 'Destination Category',
      mainTopic: 'London Tours',
      likelySearchIntent: 'Commercial investigation',
      mainEntities: ['London', 'Tower of London', 'Westminster', 'Blue Badge Guide'],
      parentSection: 'United Kingdom',
      indexability: 'Indexable',
      httpStatus: 200,
      source: 'crawl'
    },
    {
      id: 'page_9',
      url: 'https://example.com/Kyoto-Tours',
      title: 'Private Kyoto Tours - Ancient Temples, Shrines & Geisha Quarters',
      h1: 'Immerse in Traditional Kyoto with an English-Speaking Local Guide',
      metaDescription: 'Explore Fushimi Inari, Kinkaku-ji golden pavilion, and Gion historic district with expert local guides.',
      canonicalUrl: 'https://example.com/Kyoto-Tours',
      pageType: 'Destination Category',
      mainTopic: 'Kyoto Tours',
      likelySearchIntent: 'Commercial investigation',
      mainEntities: ['Kyoto', 'Fushimi Inari', 'Gion District', 'Kinkaku-ji'],
      parentSection: 'Japan',
      indexability: 'Indexable',
      httpStatus: 200,
      source: 'crawl'
    },
    {
      id: 'page_10',
      url: 'https://example.com/Shore-Excursions',
      title: 'Private Shore Excursions for Cruise Passengers Worldwide',
      h1: 'Worry-Free Private Shore Excursions with Back-to-Ship Guarantee',
      metaDescription: 'Skip crowded cruise ship buses. Book private port pick-up and drop-off shore excursions with guaranteed timely ship return.',
      canonicalUrl: 'https://example.com/Shore-Excursions',
      pageType: 'Service Landing Page',
      mainTopic: 'Shore Excursions',
      likelySearchIntent: 'Commercial investigation',
      mainEntities: ['Shore Excursions', 'Cruise Ports', 'Private Port Transfer Tour'],
      parentSection: 'Services',
      indexability: 'Indexable',
      httpStatus: 200,
      source: 'crawl'
    },
    {
      id: 'page_11',
      url: 'https://example.com/blog/private-vs-group-tours',
      title: 'Private Tours vs Group Tours: Which Is Better for Your Trip?',
      h1: 'Is a Private Tour Worth It? Complete Cost & Experience Breakdown',
      metaDescription: 'Compare flexibility, pricing, pacing, and crowd avoidance between private guided tours and large group bus excursions.',
      canonicalUrl: 'https://example.com/blog/private-vs-group-tours',
      pageType: 'Supporting Guide',
      mainTopic: 'Tour Planning Guide',
      likelySearchIntent: 'Informational',
      mainEntities: ['Private Tours vs Group Tours', 'Travel Planning', 'Tour Costs'],
      parentSection: 'Blog',
      indexability: 'Indexable',
      httpStatus: 200,
      source: 'crawl'
    }
  ];

  const competitors: CompetitorAnalysis[] = [
    {
      domain: 'https://www.viator.com',
      importantSections: ['/Rome-tours', '/Paris-food-tours', '/Shore-excursions-Civitavecchia', '/Things-to-do', '/Day-trips'],
      discoveredPagesCount: 165000,
      samplePages: [
        { url: 'https://www.viator.com/Rome-tours/d511-ttd', title: 'Top Rome Tours & Activities', pageType: 'Category', topic: 'Rome Tours' },
        { url: 'https://www.viator.com/Paris-tours/Food-Tours/d479-g6-c80', title: 'Paris Food & Wine Tastings', pageType: 'Subcategory', topic: 'Paris Food Tours' },
        { url: 'https://www.viator.com/Tokyo-tours/Mount-Fuji-Day-Trips/d334-g5-c89', title: 'Mount Fuji Day Trips from Tokyo', pageType: 'Day Trip Category', topic: 'Tokyo Day Trips' },
        { url: 'https://www.viator.com/Florence-tours/Uffizi-Skip-The-Line/d519-g12', title: 'Uffizi Gallery Guided Tours', pageType: 'Attraction Category', topic: 'Florence Uffizi' }
      ],
      repeatedTopicPatterns: [
        'Destination > City > Landmark Hub (e.g. Rome > Colosseum)',
        'Port > Direct Shore Excursion with On-Time Return Guarantee',
        'Top 10 Things to Do in [City] Editorial Guides',
        'Day Trips from [Major City] to [Scenic Region]'
      ],
      commercialPageTypes: ['City category hub', 'Landmark booking page', 'Skip the line ticket pass', 'Port shore excursion list', 'Small group food crawl'],
      informationalPageTypes: ['Travel blogs', '3-day city itineraries', 'Neighborhood guides', 'Museum visitor tips & dress codes'],
      locationCategoryStructures: ['Continent / Country / Region / City / Landmark'],
      extractedTopics: ['Private walking tours', 'Vatican skip the line', 'Civitavecchia port transfer tour', 'Colosseum underground', 'Versailles private guide', 'Tsukiji fish market tour'],
      uniqueTopics: ['Colosseum underground night tours', 'Civitavecchia direct port pickup tours', 'Paris bakery behind the scenes tour', 'Kyoto tea ceremony private masterclass']
    },
    {
      domain: 'https://www.getyourguide.com',
      importantSections: ['/rome-l33', '/paris-l16', '/tokyo-l193', '/florence-l35', '/barcelona-l45', '/activities'],
      discoveredPagesCount: 140000,
      samplePages: [
        { url: 'https://www.getyourguide.com/rome-l33/colosseum-tours', title: 'Colosseum Guided Tours Rome', pageType: 'Subcategory', topic: 'Colosseum Tours' },
        { url: 'https://www.getyourguide.com/tokyo-l193/food-tours', title: 'Tokyo Street Food & Night Walks', pageType: 'Subcategory', topic: 'Tokyo Food Tours' },
        { url: 'https://www.getyourguide.com/barcelona-l45/sagrada-familia-tours', title: 'Sagrada Familia Guided Tours', pageType: 'Attraction Category', topic: 'Sagrada Familia' }
      ],
      repeatedTopicPatterns: [
        'Landmark > Fast Track Ticket vs Guided Tour Comparison',
        'City > Best Food Tours & Secret Culinary Walks',
        'Day Trips from [City] to [Nearby Region] with Private Vehicle'
      ],
      commercialPageTypes: ['Activity listings', 'City attractions', 'Day trips hub', 'Private guide booking'],
      informationalPageTypes: ['Curated attraction guides', 'Traveler FAQ', 'Best time to visit city guides'],
      locationCategoryStructures: ['Continent / Country / City / Activity Category'],
      extractedTopics: ['Rome food tour Trastevere', 'Versailles private guided tour', 'Tokyo street food tour', 'Florence Tuscany wine tour', 'Barcelona tapas crawl'],
      uniqueTopics: ['Trastevere sunset street food tour', 'Tokyo Tsukiji outer market guided tour', 'Giverny Monet garden day trip from Paris', 'Montserrat monastery sunrise tour']
    },
    {
      domain: 'https://www.withlocals.com',
      importantSections: ['/tours/italy/rome', '/tours/france/paris', '/tours/japan/tokyo', '/tours/spain/barcelona'],
      discoveredPagesCount: 38000,
      samplePages: [
        { url: 'https://www.withlocals.com/tours/italy/rome/food-tours', title: 'The 10 Tastings of Rome Food Tour', pageType: 'Product Page', topic: 'Rome Food Tour' },
        { url: 'https://www.withlocals.com/tours/france/paris/highlights', title: 'Highlights & Hidden Gems of Paris', pageType: 'Product Page', topic: 'Paris Highlights' }
      ],
      repeatedTopicPatterns: [
        '100% Customizable [City] Private Tour',
        'Highlights & Hidden Gems of [City]',
        'The 10 Tastings: Local Food Tour of [City]'
      ],
      commercialPageTypes: ['Host profile pages', 'Custom tour booking pages', 'Off the beaten path walks'],
      informationalPageTypes: ['Local host blogs', 'Insider neighbourhood secrets'],
      locationCategoryStructures: ['Country / City / Experience Type'],
      extractedTopics: ['Hidden gems private tour', '10 tastings local food tour', 'City kickstart private tour'],
      uniqueTopics: ['Meet the local host direct video intro', 'Fully personalized itinerary builder']
    }
  ];

  // Comprehensive 80+ Keywords covering 15+ major global cities and travel categories
  const keywords: KeywordItem[] = [
    // 1. ROME (Italy)
    createKeyword('kw_1', 'private tour guide rome', 'Rome Tours', 'Local Guides', 'Rome Local Guide', 'Commercial investigation', 'Consideration', 'Destination Category', 'Essential', 'Service', 'Rome', 'business_model'),
    createKeyword('kw_2', 'hire private guide rome colosseum', 'Rome Tours', 'Colosseum', 'Colosseum Guide', 'Transactional', 'Decision', 'Commercial Landing Page', 'Essential', 'Service', 'Rome', 'autocomplete'),
    createKeyword('kw_3', 'rome private walking tour with local', 'Rome Tours', 'Walking Tours', 'Rome Walking Tour', 'Commercial investigation', 'Consideration', 'Destination Category', 'Strongly relevant', 'Category', 'Rome', 'seed'),
    createKeyword('kw_4', 'private vatican museum tour with art historian', 'Rome Tours', 'Vatican', 'Vatican Art Historian', 'Transactional', 'Decision', 'Tour detail', 'Essential', 'Service', 'Rome', 'competitor', 'viator.com'),
    createKeyword('kw_5', 'rome trastevere private food and wine walk', 'Rome Tours', 'Food Tours', 'Trastevere Food Walk', 'Transactional', 'Decision', 'Tour detail', 'Strongly relevant', 'Category', 'Rome', 'competitor', 'getyourguide.com'),
    createKeyword('kw_6', 'best private tours in rome with driver', 'Rome Tours', 'Private Drivers', 'Rome Chauffeured Tour', 'Commercial investigation', 'Consideration', 'Tour category', 'Strongly relevant', 'Best', 'Rome', 'competitor', 'viator.com'),

    // 2. PARIS (France)
    createKeyword('kw_7', 'private food tour paris montmartre', 'Paris Tours', 'Food Tours', 'Montmartre Food Tour', 'Commercial investigation', 'Consideration', 'Category Sub-Hub', 'Strongly relevant', 'Category', 'Paris', 'autocomplete'),
    createKeyword('kw_8', 'best paris private culinary tour', 'Paris Tours', 'Food Tours', 'Paris Culinary Tour', 'Commercial investigation', 'Consideration', 'Category Sub-Hub', 'Strongly relevant', 'Best', 'Paris', 'seed'),
    createKeyword('kw_9', 'hire private english tour guide in paris', 'Paris Tours', 'Local Guides', 'Paris English Guide', 'Transactional', 'Decision', 'Commercial Landing Page', 'Essential', 'Service', 'Paris', 'business_model'),
    createKeyword('kw_10', 'private louvre museum guided tour with kids', 'Paris Tours', 'Museum Tours', 'Louvre Family Tour', 'Commercial investigation', 'Consideration', 'Tour detail', 'Strongly relevant', 'Category', 'Paris', 'related_search'),
    createKeyword('kw_11', 'versailles private day trip from paris with car', 'Paris Tours', 'Day Trips', 'Versailles Private Tour', 'Transactional', 'Decision', 'Day Trip Destination Page', 'Essential', 'Location', 'Paris / Versailles', 'competitor', 'viator.com'),
    createKeyword('kw_12', 'secret paris hidden gems private walking tour', 'Paris Tours', 'Walking Tours', 'Paris Hidden Gems', 'Commercial investigation', 'Consideration', 'Category Sub-Hub', 'Relevant', 'Service', 'Paris', 'competitor', 'withlocals.com'),

    // 3. TOKYO (Japan)
    createKeyword('kw_13', 'tokyo private day trip mt fuji with driver', 'Tokyo Tours', 'Day Trips', 'Mt Fuji Day Trip', 'Commercial investigation', 'Consideration', 'Day Trip Destination Page', 'Strongly relevant', 'Location', 'Tokyo / Mt Fuji', 'competitor', 'getyourguide.com'),
    createKeyword('kw_14', 'hire private english speaking guide tokyo', 'Tokyo Tours', 'Local Guides', 'Tokyo English Guide', 'Transactional', 'Decision', 'Destination Category', 'Essential', 'Service', 'Tokyo', 'business_model'),
    createKeyword('kw_15', 'tokyo tsukiji outer market private food walk', 'Tokyo Tours', 'Food Tours', 'Tsukiji Fish Market', 'Transactional', 'Decision', 'Tour detail', 'Strongly relevant', 'Category', 'Tokyo', 'competitor', 'getyourguide.com'),
    createKeyword('kw_16', 'customized 1 day tokyo private walking itinerary', 'Tokyo Tours', 'Walking Tours', 'Tokyo Custom Itinerary', 'Commercial investigation', 'Consideration', 'Destination Category', 'Strongly relevant', 'Guide', 'Tokyo', 'seed'),
    createKeyword('kw_17', 'shinjuku and shibuya private nightlife and food tour', 'Tokyo Tours', 'Food & Nightlife', 'Tokyo Nightlife Tour', 'Commercial investigation', 'Consideration', 'Tour detail', 'Relevant', 'Category', 'Tokyo', 'autocomplete'),

    // 4. FLORENCE & TUSCANY (Italy)
    createKeyword('kw_18', 'private tour guide florence uffizi and accademia', 'Florence Tours', 'Museum Tours', 'Florence Uffizi Guide', 'Transactional', 'Decision', 'Tour detail', 'Essential', 'Service', 'Florence', 'seed'),
    createKeyword('kw_19', 'private tuscany wine tour from florence with driver', 'Florence Tours', 'Day Trips & Wine', 'Tuscany Wine Tour', 'Transactional', 'Decision', 'Day Trip Destination Page', 'Essential', 'Location', 'Florence / Tuscany', 'competitor', 'viator.com'),
    createKeyword('kw_20', 'family friendly private tour florence with kids', 'Florence Tours', 'Family Travel', 'Florence with Children', 'Commercial investigation', 'Consideration', 'Tour category', 'Strongly relevant', 'Category', 'Florence', 'related_search'),
    createKeyword('kw_21', 'florence renaissance history private walking tour', 'Florence Tours', 'Historical Tours', 'Florence Renaissance Walk', 'Commercial investigation', 'Consideration', 'Destination Category', 'Strongly relevant', 'Category', 'Florence', 'autocomplete'),

    // 5. VENICE (Italy)
    createKeyword('kw_22', 'private tour guide venice st marks and doges palace', 'Venice Tours', 'Landmark Tours', 'Venice Doges Palace', 'Transactional', 'Decision', 'Tour detail', 'Essential', 'Service', 'Venice', 'business_model'),
    createKeyword('kw_23', 'secret venice private walking tour off the beaten path', 'Venice Tours', 'Walking Tours', 'Venice Hidden Canals', 'Commercial investigation', 'Consideration', 'Category Sub-Hub', 'Strongly relevant', 'Service', 'Venice', 'competitor', 'withlocals.com'),
    createKeyword('kw_24', 'private murano burano boat tour with local guide', 'Venice Tours', 'Day Trips & Islands', 'Murano Glass Tour', 'Transactional', 'Decision', 'Tour detail', 'Strongly relevant', 'Location', 'Venice / Murano', 'competitor', 'viator.com'),
    createKeyword('kw_25', 'venice cicchetti and wine private food crawl', 'Venice Tours', 'Food Tours', 'Venice Cicchetti Tour', 'Transactional', 'Decision', 'Tour detail', 'Strongly relevant', 'Category', 'Venice', 'autocomplete'),

    // 6. BARCELONA (Spain)
    createKeyword('kw_26', 'barcelona private tour guide gothic quarter', 'Barcelona Tours', 'Neighbourhood Tours', 'Gothic Quarter Barcelona', 'Transactional', 'Decision', 'Tour category', 'Essential', 'Location', 'Barcelona', 'business_model'),
    createKeyword('kw_27', 'sagrada familia and gaudi private tour with architect', 'Barcelona Tours', 'Architectural Tours', 'Sagrada Familia Guide', 'Transactional', 'Decision', 'Tour detail', 'Essential', 'Service', 'Barcelona', 'competitor', 'getyourguide.com'),
    createKeyword('kw_28', 'barcelona private tapas and wine walking tour', 'Barcelona Tours', 'Food Tours', 'Barcelona Tapas Tour', 'Transactional', 'Decision', 'Tour detail', 'Strongly relevant', 'Category', 'Barcelona', 'autocomplete'),
    createKeyword('kw_29', 'montserrat monastery private day trip from barcelona', 'Barcelona Tours', 'Day Trips', 'Montserrat Tour', 'Commercial investigation', 'Consideration', 'Day Trip Destination Page', 'Strongly relevant', 'Location', 'Barcelona / Montserrat', 'competitor', 'viator.com'),

    // 7. LONDON & UK (United Kingdom)
    createKeyword('kw_30', 'private blue badge tour guide london', 'London Tours', 'Certified Guides', 'London Blue Badge Guide', 'Transactional', 'Decision', 'Destination Category', 'Essential', 'Service', 'London', 'business_model'),
    createKeyword('kw_31', 'tower of london and westminster abbey private tour', 'London Tours', 'Historical Tours', 'Tower of London Tour', 'Transactional', 'Decision', 'Tour detail', 'Essential', 'Service', 'London', 'competitor', 'viator.com'),
    createKeyword('kw_32', 'cotswolds private day trip from london with driver', 'London Tours', 'Day Trips', 'Cotswolds Private Tour', 'Commercial investigation', 'Consideration', 'Day Trip Destination Page', 'Strongly relevant', 'Location', 'London / Cotswolds', 'competitor', 'viator.com'),
    createKeyword('kw_33', 'london historical pubs and secret alleys private walk', 'London Tours', 'Pub & Secret Walks', 'London Historic Pubs', 'Commercial investigation', 'Consideration', 'Tour detail', 'Relevant', 'Category', 'London', 'related_search'),

    // 8. KYOTO (Japan)
    createKeyword('kw_34', 'kyoto private tour guide ancient temples and shrines', 'Kyoto Tours', 'Historical Temples', 'Kyoto Temple Guide', 'Transactional', 'Decision', 'Destination Category', 'Essential', 'Service', 'Kyoto', 'seed'),
    createKeyword('kw_35', 'fushimi inari and gion private geisha quarter walk', 'Kyoto Tours', 'Cultural Walks', 'Gion Geisha Walk', 'Commercial investigation', 'Consideration', 'Tour detail', 'Strongly relevant', 'Location', 'Kyoto', 'autocomplete'),
    createKeyword('kw_36', 'nara deer park day trip from kyoto with private guide', 'Kyoto Tours', 'Day Trips', 'Nara Private Tour', 'Commercial investigation', 'Consideration', 'Day Trip Destination Page', 'Strongly relevant', 'Location', 'Kyoto / Nara', 'competitor', 'getyourguide.com'),

    // 9. SHORE EXCURSIONS & CRUISE PORTS
    createKeyword('kw_37', 'civitavecchia private shore excursions to rome', 'Shore Excursions', 'Civitavecchia Port', 'Civitavecchia Port', 'Commercial investigation', 'Decision', 'Port Shore Excursions Landing Page', 'Essential', 'Location', 'Civitavecchia / Rome', 'competitor', 'viator.com'),
    createKeyword('kw_38', 'civitavecchia port to rome private tour and transfer', 'Shore Excursions', 'Civitavecchia Port', 'Port Transfer Tour', 'Transactional', 'Decision', 'Port Shore Excursions Landing Page', 'Essential', 'Service', 'Civitavecchia', 'competitor', 'viator.com'),
    createKeyword('kw_39', 'naples port private shore excursion to pompeii and amalfi', 'Shore Excursions', 'Naples & Amalfi Port', 'Naples Port Excursions', 'Transactional', 'Decision', 'Port Shore Excursions Landing Page', 'Essential', 'Location', 'Naples / Amalfi', 'competitor', 'viator.com'),
    createKeyword('kw_40', 'marseille cruise port private shore tour to aix en provence', 'Shore Excursions', 'Marseille Port', 'Marseille Shore Tour', 'Commercial investigation', 'Consideration', 'Port Shore Excursions Landing Page', 'Strongly relevant', 'Location', 'Marseille / Provence', 'competitor', 'viator.com'),
    createKeyword('kw_41', 'dubrovnik cruise port private game of thrones walking tour', 'Shore Excursions', 'Dubrovnik Port', 'Dubrovnik Shore Tour', 'Transactional', 'Decision', 'Tour detail', 'Strongly relevant', 'Category', 'Dubrovnik', 'related_search'),
    createKeyword('kw_42', 'santorini port private caldera wine and oia tour', 'Shore Excursions', 'Santorini Port', 'Santorini Shore Excursion', 'Transactional', 'Decision', 'Port Shore Excursions Landing Page', 'Essential', 'Location', 'Santorini', 'autocomplete'),

    // 10. MONTREAL & NORTH AMERICA
    createKeyword('kw_43', 'private walking tour montreal old port', 'Montreal Tours', 'Historical Walking Tours', 'Old Montreal', 'Commercial investigation', 'Consideration', 'Tour category', 'Strongly relevant', 'Location', 'Montreal', 'business_model'),
    createKeyword('kw_44', 'montreal private food tour mile end bagels and poutine', 'Montreal Tours', 'Food Tours', 'Montreal Food Tour', 'Transactional', 'Decision', 'Tour detail', 'Strongly relevant', 'Category', 'Montreal', 'seed'),
    createKeyword('kw_45', 'quebec city old town private walking tour with historian', 'Quebec Tours', 'Historical Tours', 'Quebec City Guide', 'Commercial investigation', 'Consideration', 'Tour category', 'Strongly relevant', 'Service', 'Quebec City', 'autocomplete'),
    createKeyword('kw_46', 'new york private tour guide central park and hidden history', 'New York Tours', 'City Highlights', 'NYC Local Guide', 'Commercial investigation', 'Consideration', 'Destination Category', 'Essential', 'Service', 'New York City', 'business_model'),
    createKeyword('kw_47', 'san francisco private tour alcatraz and sausalito with driver', 'San Francisco Tours', 'City & Bay Tours', 'San Francisco Tour', 'Transactional', 'Decision', 'Tour category', 'Strongly relevant', 'Location', 'San Francisco', 'competitor', 'viator.com'),

    // 11. AMSTERDAM & NORTHERN EUROPE
    createKeyword('kw_48', 'private tour guide amsterdam canals and jordaan', 'Amsterdam Tours', 'Canal Walks', 'Amsterdam Jordaan Guide', 'Commercial investigation', 'Consideration', 'Destination Category', 'Essential', 'Service', 'Amsterdam', 'business_model'),
    createKeyword('kw_49', 'rijksmuseum and van gogh private guided art tour', 'Amsterdam Tours', 'Museum Tours', 'Rijksmuseum Guide', 'Transactional', 'Decision', 'Tour detail', 'Essential', 'Service', 'Amsterdam', 'competitor', 'getyourguide.com'),
    createKeyword('kw_50', 'zaanse schans windmills private day trip from amsterdam', 'Amsterdam Tours', 'Day Trips', 'Zaanse Schans Tour', 'Commercial investigation', 'Consideration', 'Day Trip Destination Page', 'Strongly relevant', 'Location', 'Amsterdam / Zaanse Schans', 'autocomplete'),

    // 12. ATHENS & GREECE
    createKeyword('kw_51', 'acropolis of athens private guided tour with archaeologist', 'Athens Tours', 'Archaeological Tours', 'Acropolis Private Guide', 'Transactional', 'Decision', 'Tour detail', 'Essential', 'Service', 'Athens', 'seed'),
    createKeyword('kw_52', 'athens street food and plaka private walking tour', 'Athens Tours', 'Food & Plaka', 'Athens Food Tour', 'Transactional', 'Decision', 'Tour detail', 'Strongly relevant', 'Category', 'Athens', 'competitor', 'withlocals.com'),
    createKeyword('kw_53', 'cape sounion and temple of poseidon sunset private tour', 'Athens Tours', 'Day Trips', 'Cape Sounion Tour', 'Commercial investigation', 'Consideration', 'Day Trip Destination Page', 'Strongly relevant', 'Location', 'Athens / Sounion', 'viator.com' as any),

    // 13. MADRID & SEVILLE (Spain)
    createKeyword('kw_54', 'madrid prado museum private tour with art historian', 'Madrid Tours', 'Museum Tours', 'Prado Museum Guide', 'Transactional', 'Decision', 'Tour detail', 'Essential', 'Service', 'Madrid', 'autocomplete'),
    createKeyword('kw_55', 'toledo private day trip from madrid with private car', 'Madrid Tours', 'Day Trips', 'Toledo Day Trip', 'Commercial investigation', 'Consideration', 'Day Trip Destination Page', 'Strongly relevant', 'Location', 'Madrid / Toledo', 'competitor', 'viator.com'),
    createKeyword('kw_56', 'seville alcazar and cathedral private tour guide', 'Seville Tours', 'Moorish Heritage', 'Seville Alcazar Guide', 'Transactional', 'Decision', 'Tour detail', 'Essential', 'Service', 'Seville', 'seed'),

    // 14. EDINBURGH & SCOTLAND (UK)
    createKeyword('kw_57', 'edinburgh castle and royal mile private walking tour', 'Edinburgh Tours', 'Old Town & Castle', 'Edinburgh Castle Tour', 'Commercial investigation', 'Consideration', 'Destination Category', 'Essential', 'Location', 'Edinburgh', 'business_model'),
    createKeyword('kw_58', 'scottish highlands and loch ness private day tour from edinburgh', 'Edinburgh Tours', 'Highlands Day Trips', 'Highlands Private Tour', 'Commercial investigation', 'Consideration', 'Day Trip Destination Page', 'Strongly relevant', 'Location', 'Edinburgh / Highlands', 'competitor', 'viator.com'),

    // 15. INFORMATIONAL GUIDES & CUSTOMER JOURNEY
    createKeyword('kw_59', 'private vs group tours pros and cons', 'Travel Guides & Etiquette', 'Tour Selection', 'Private vs Group Tours', 'Informational', 'Awareness', 'Supporting Guide', 'Relevant', 'Comparison', undefined, 'business_model'),
    createKeyword('kw_60', 'how to tip private tour guide in europe', 'Travel Guides & Etiquette', 'Tipping Guides', 'Tour Guide Tipping', 'Informational', 'Awareness', 'Supporting Guide', 'Relevant', 'How-to', undefined, 'related_search'),
    createKeyword('kw_61', 'how do cruise shore excursions work', 'Travel Guides & Etiquette', 'Cruise Advice', 'Shore Excursion Planning', 'Informational', 'Awareness', 'Supporting Guide', 'Relevant', 'Question', undefined, 'autocomplete'),
    createKeyword('kw_62', 'how to hire vetted local guide abroad safely', 'Travel Guides & Etiquette', 'Guide Verification', 'Verified Local Guides', 'Informational', 'Awareness', 'Supporting Guide', 'Strongly relevant', 'How-to', undefined, 'business_model'),
    createKeyword('kw_63', 'is a private tour guide worth the money in europe', 'Travel Guides & Etiquette', 'Cost Value Analysis', 'Private Guide ROI', 'Informational', 'Consideration', 'Supporting Guide', 'Relevant', 'Review', undefined, 'related_search'),
    createKeyword('kw_64', 'how to customize a private tour itinerary with your guide', 'Travel Guides & Etiquette', 'Itinerary Planning', 'Custom Tour Planning', 'Informational', 'Consideration', 'Supporting Guide', 'Strongly relevant', 'How-to', undefined, 'business_model')
  ];

  // Intent-based page clusters
  const clusters: KeywordCluster[] = [
    {
      id: 'cluster_1',
      clusterName: 'Rome Private Guides & Walking Tours Hub',
      primaryKeyword: 'private tour guide rome',
      secondaryKeywords: ['rome private walking tour with local', 'best private tours in rome with driver', 'custom rome walking itinerary'],
      coreTopic: 'Rome Tours',
      subtopic: 'Walking Tours & Hub',
      searchIntent: 'Commercial investigation',
      recommendedPageType: 'Destination Hub Page',
      journeyStage: 'Consideration',
      businessRelevance: 'Essential',
      reasonForGrouping: 'All represent broad commercial searches for private guide services in Rome, best served by a primary destination hub.',
      confidence: 'High'
    },
    {
      id: 'cluster_2',
      clusterName: 'Rome Colosseum & Vatican Private Tours',
      primaryKeyword: 'hire private guide rome colosseum',
      secondaryKeywords: ['private vatican museum tour with art historian', 'colosseum private tour with local guide'],
      coreTopic: 'Rome Tours',
      subtopic: 'Ancient Landmarks',
      searchIntent: 'Transactional',
      recommendedPageType: 'Commercial Landing Page',
      journeyStage: 'Decision',
      businessRelevance: 'Essential',
      reasonForGrouping: 'High-intent commercial buyers specifically seeking private skip-the-line guided visits to Rome top two monumental attractions.',
      confidence: 'High'
    },
    {
      id: 'cluster_3',
      clusterName: 'Paris Gourmet Food & Wine Walks',
      primaryKeyword: 'private food tour paris montmartre',
      secondaryKeywords: ['best paris private culinary tour', 'le marais private food crawl', 'secret culinary tastings paris'],
      coreTopic: 'Paris Tours',
      subtopic: 'Culinary Experiences',
      searchIntent: 'Commercial investigation',
      recommendedPageType: 'Category Sub-Hub',
      journeyStage: 'Consideration',
      businessRelevance: 'Strongly relevant',
      reasonForGrouping: 'Foodie travellers looking for specialized local culinary, pastry, and wine walking experiences across Montmartre and Le Marais.',
      confidence: 'High'
    },
    {
      id: 'cluster_4',
      clusterName: 'Paris Local Guides & Versailles Excursions',
      primaryKeyword: 'hire private english tour guide in paris',
      secondaryKeywords: ['versailles private day trip from paris with car', 'private louvre museum guided tour with kids'],
      coreTopic: 'Paris Tours',
      subtopic: 'Guides & Excursions',
      searchIntent: 'Transactional',
      recommendedPageType: 'Destination Hub Page',
      journeyStage: 'Decision',
      businessRelevance: 'Essential',
      reasonForGrouping: 'Travellers actively looking to hire verified private English-speaking guides for city sights and day trips to Versailles.',
      confidence: 'High'
    },
    {
      id: 'cluster_5',
      clusterName: 'Tokyo Highlights & Mt Fuji Day Trips',
      primaryKeyword: 'tokyo private day trip mt fuji with driver',
      secondaryKeywords: ['hire private english speaking guide tokyo', 'customized 1 day tokyo private walking itinerary'],
      coreTopic: 'Tokyo Tours',
      subtopic: 'Day Excursions & City Hub',
      searchIntent: 'Commercial investigation',
      recommendedPageType: 'Day Trip Destination Page',
      journeyStage: 'Consideration',
      businessRelevance: 'Essential',
      reasonForGrouping: 'Travelers in Tokyo seeking custom day trips to Mt Fuji and full-day private walking itineraries with English speakers.',
      confidence: 'High'
    },
    {
      id: 'cluster_6',
      clusterName: 'Florence Renaissance & Uffizi Tours',
      primaryKeyword: 'private tour guide florence uffizi and accademia',
      secondaryKeywords: ['florence renaissance history private walking tour', 'family friendly private tour florence with kids'],
      coreTopic: 'Florence Tours',
      subtopic: 'Art & Renaissance Walks',
      searchIntent: 'Transactional',
      recommendedPageType: 'Destination Hub Page',
      journeyStage: 'Decision',
      businessRelevance: 'Essential',
      reasonForGrouping: 'Art and history enthusiasts booking private art historian guides for Florence top Renaissance galleries and historical centers.',
      confidence: 'High'
    },
    {
      id: 'cluster_7',
      clusterName: 'Tuscany Wine Tours from Florence',
      primaryKeyword: 'private tuscany wine tour from florence with driver',
      secondaryKeywords: ['chianti wine tasting private driver from florence', 'san gimignano day trip with local guide'],
      coreTopic: 'Florence Tours',
      subtopic: 'Wine & Countryside Day Trips',
      searchIntent: 'Transactional',
      recommendedPageType: 'Day Trip Destination Page',
      journeyStage: 'Decision',
      businessRelevance: 'Essential',
      reasonForGrouping: 'Travellers based in Florence wanting dedicated chauffeured wine tastings in Chianti and Tuscan hilltowns.',
      confidence: 'High'
    },
    {
      id: 'cluster_8',
      clusterName: 'Venice Secret Canals & Murano Islands',
      primaryKeyword: 'private tour guide venice st marks and doges palace',
      secondaryKeywords: ['secret venice private walking tour off the beaten path', 'private murano burano boat tour with local guide'],
      coreTopic: 'Venice Tours',
      subtopic: 'Lagoon & Island Excursions',
      searchIntent: 'Commercial investigation',
      recommendedPageType: 'Destination Hub Page',
      journeyStage: 'Consideration',
      businessRelevance: 'Essential',
      reasonForGrouping: 'Venice visitors booking private guides for St Marks Square, secret alleys, and private water taxi lagoon tours.',
      confidence: 'High'
    },
    {
      id: 'cluster_9',
      clusterName: 'Barcelona Gaudi & Gothic Quarter Tours',
      primaryKeyword: 'barcelona private tour guide gothic quarter',
      secondaryKeywords: ['sagrada familia and gaudi private tour with architect', 'barcelona private tapas and wine walking tour'],
      coreTopic: 'Barcelona Tours',
      subtopic: 'Gaudi Architecture & Tapas',
      searchIntent: 'Transactional',
      recommendedPageType: 'Destination Hub Page',
      journeyStage: 'Decision',
      businessRelevance: 'Essential',
      reasonForGrouping: 'Travellers wanting expert local guidance through Sagrada Familia, Park Guell, and the historic Gothic Quarter.',
      confidence: 'High'
    },
    {
      id: 'cluster_10',
      clusterName: 'London Blue Badge Historians & Cotswolds Trips',
      primaryKeyword: 'private blue badge tour guide london',
      secondaryKeywords: ['tower of london and westminster abbey private tour', 'cotswolds private day trip from london with driver'],
      coreTopic: 'London Tours',
      subtopic: 'Royal History & Countryside',
      searchIntent: 'Transactional',
      recommendedPageType: 'Destination Hub Page',
      journeyStage: 'Decision',
      businessRelevance: 'Essential',
      reasonForGrouping: 'Discerning tourists seeking verified official Blue Badge guides for Westminster, Tower of London, and Cotswolds day trips.',
      confidence: 'High'
    },
    {
      id: 'cluster_11',
      clusterName: 'Civitavecchia to Rome Port Shore Excursions',
      primaryKeyword: 'civitavecchia private shore excursions to rome',
      secondaryKeywords: ['civitavecchia port to rome private tour and transfer', 'rome cruise port private driver pickup'],
      coreTopic: 'Shore Excursions',
      subtopic: 'Civitavecchia Port',
      searchIntent: 'Commercial investigation',
      recommendedPageType: 'Port Shore Excursions Landing Page',
      journeyStage: 'Decision',
      businessRelevance: 'Essential',
      reasonForGrouping: 'Cruise ship passengers docking at Civitavecchia needing seamless port pickup, Colosseum visit, and guaranteed timely ship return.',
      confidence: 'High'
    },
    {
      id: 'cluster_12',
      clusterName: 'Naples, Pompeii & Amalfi Coast Shore Excursions',
      primaryKeyword: 'naples port private shore excursion to pompeii and amalfi',
      secondaryKeywords: ['pompeii private archaeologist guide from naples port', 'amalfi coast scenic drive private excursion'],
      coreTopic: 'Shore Excursions',
      subtopic: 'Naples & Amalfi Port',
      searchIntent: 'Transactional',
      recommendedPageType: 'Port Shore Excursions Landing Page',
      journeyStage: 'Decision',
      businessRelevance: 'Essential',
      reasonForGrouping: 'Cruise passengers docking in Naples wanting private driver tours to Pompeii ruins and Positano cliffs.',
      confidence: 'High'
    },
    {
      id: 'cluster_13',
      clusterName: 'Kyoto Historic Temples & Shrines Hub',
      primaryKeyword: 'kyoto private tour guide ancient temples and shrines',
      secondaryKeywords: ['fushimi inari and gion private geisha quarter walk', 'nara deer park day trip from kyoto with private guide'],
      coreTopic: 'Kyoto Tours',
      subtopic: 'Temples & Cultural Walks',
      searchIntent: 'Commercial investigation',
      recommendedPageType: 'Destination Hub Page',
      journeyStage: 'Consideration',
      businessRelevance: 'Essential',
      reasonForGrouping: 'Visitors to Kyoto seeking immersive cultural and temple walking tours with English-fluent local hosts.',
      confidence: 'High'
    },
    {
      id: 'cluster_14',
      clusterName: 'Amsterdam Canals & Art Museums',
      primaryKeyword: 'private tour guide amsterdam canals and jordaan',
      secondaryKeywords: ['rijksmuseum and van gogh private guided art tour', 'zaanse schans windmills private day trip from amsterdam'],
      coreTopic: 'Amsterdam Tours',
      subtopic: 'Canals & Museums',
      searchIntent: 'Commercial investigation',
      recommendedPageType: 'Destination Hub Page',
      journeyStage: 'Consideration',
      businessRelevance: 'Essential',
      reasonForGrouping: 'Tourists seeking authentic Jordaan canal walks and private art tours through the Rijksmuseum.',
      confidence: 'High'
    },
    {
      id: 'cluster_15',
      clusterName: 'Athens Acropolis Archaeologist Guides',
      primaryKeyword: 'acropolis of athens private guided tour with archaeologist',
      secondaryKeywords: ['athens street food and plaka private walking tour', 'cape sounion and temple of poseidon sunset private tour'],
      coreTopic: 'Athens Tours',
      subtopic: 'Archaeology & Plaka',
      searchIntent: 'Transactional',
      recommendedPageType: 'Destination Hub Page',
      journeyStage: 'Decision',
      businessRelevance: 'Essential',
      reasonForGrouping: 'Travelers to Athens seeking licensed archaeologist-led private tours of the Acropolis and Plaka.',
      confidence: 'High'
    },
    {
      id: 'cluster_16',
      clusterName: 'Private vs Group Tour Comparison & Tipping Guides',
      primaryKeyword: 'private vs group tours pros and cons',
      secondaryKeywords: ['how to tip private tour guide in europe', 'is a private tour guide worth the money in europe', 'how to hire vetted local guide abroad safely'],
      coreTopic: 'Travel Guides & Etiquette',
      subtopic: 'Traveler Decision Framework',
      searchIntent: 'Informational',
      recommendedPageType: 'Supporting Guide',
      journeyStage: 'Awareness',
      businessRelevance: 'Relevant',
      reasonForGrouping: 'Top-of-funnel educational queries addressing pricing, etiquette, and safety considerations before booking a private guide.',
      confidence: 'High'
    }
  ];

  // Page mappings
  const mappings: PageMapping[] = [
    {
      id: 'map_1',
      clusterId: 'cluster_1',
      clusterName: 'Rome Private Guides & Walking Tours Hub',
      primaryKeyword: 'private tour guide rome',
      secondaryKeywords: ['rome private walking tour with local', 'best private tours in rome with driver'],
      existingPageId: 'page_2',
      existingUrl: 'https://example.com/Rome-Tours',
      existingPageTitle: 'Private Tours in Rome - Top Rated Local Rome Tour Guides',
      mappingStrength: 'Strong match',
      matchExplanation: 'Existing destination category page targets Rome tours with high intent alignment.',
      recommendedAction: 'Optimize existing page',
      confidence: 'High'
    },
    {
      id: 'map_2',
      clusterId: 'cluster_2',
      clusterName: 'Rome Colosseum & Vatican Private Tours',
      primaryKeyword: 'hire private guide rome colosseum',
      secondaryKeywords: ['private vatican museum tour with art historian'],
      mappingStrength: 'No matching page',
      matchExplanation: 'The domain has a general Rome hub, but lacks dedicated landmark landing pages for Colosseum and Vatican skip-the-line guide bookings.',
      recommendedAction: 'Create a new page',
      confidence: 'High'
    },
    {
      id: 'map_3',
      clusterId: 'cluster_3',
      clusterName: 'Paris Gourmet Food & Wine Walks',
      primaryKeyword: 'private food tour paris montmartre',
      secondaryKeywords: ['best paris private culinary tour', 'le marais private food crawl'],
      existingPageId: 'page_3',
      existingUrl: 'https://example.com/Paris-Tours',
      existingPageTitle: 'Private Tours in Paris - Custom Paris Itineraries',
      mappingStrength: 'Partial match',
      matchExplanation: 'The Paris hub touches on food tours but lacks a dedicated subcategory page to capture specific Montmartre culinary searches.',
      recommendedAction: 'Create a new page',
      confidence: 'High'
    },
    {
      id: 'map_4',
      clusterId: 'cluster_4',
      clusterName: 'Paris Local Guides & Versailles Excursions',
      primaryKeyword: 'hire private english tour guide in paris',
      secondaryKeywords: ['versailles private day trip from paris with car'],
      existingPageId: 'page_3',
      existingUrl: 'https://example.com/Paris-Tours',
      existingPageTitle: 'Private Tours in Paris - Custom Paris Itineraries with Local Experts',
      mappingStrength: 'Strong match',
      matchExplanation: 'Matches general Paris local guide hire intent; recommended to expand with Versailles day trip sub-module.',
      recommendedAction: 'Expand existing page',
      confidence: 'High'
    },
    {
      id: 'map_5',
      clusterId: 'cluster_5',
      clusterName: 'Tokyo Highlights & Mt Fuji Day Trips',
      primaryKeyword: 'tokyo private day trip mt fuji with driver',
      secondaryKeywords: ['hire private english speaking guide tokyo'],
      existingPageId: 'page_4',
      existingUrl: 'https://example.com/Tokyo-Tours',
      existingPageTitle: 'Tokyo Private Tours & Day Trips with English-Speaking Guides',
      mappingStrength: 'Partial match',
      matchExplanation: 'Existing Tokyo page covers general tours, but competitors dominate with dedicated /tokyo/mount-fuji-day-trips URLs.',
      recommendedAction: 'Create a new page',
      confidence: 'High'
    },
    {
      id: 'map_6',
      clusterId: 'cluster_6',
      clusterName: 'Florence Renaissance & Uffizi Tours',
      primaryKeyword: 'private tour guide florence uffizi and accademia',
      secondaryKeywords: ['florence renaissance history private walking tour'],
      existingPageId: 'page_5',
      existingUrl: 'https://example.com/Florence-Tours',
      existingPageTitle: 'Private Florence Tours - Uffizi & Renaissance Walking Tours',
      mappingStrength: 'Strong match',
      matchExplanation: 'Primary Florence hub aligns well with Uffizi & Accademia museum requests.',
      recommendedAction: 'Optimize existing page',
      confidence: 'High'
    },
    {
      id: 'map_7',
      clusterId: 'cluster_7',
      clusterName: 'Tuscany Wine Tours from Florence',
      primaryKeyword: 'private tuscany wine tour from florence with driver',
      secondaryKeywords: ['chianti wine tasting private driver from florence'],
      mappingStrength: 'No matching page',
      matchExplanation: 'Florence hub exists, but wine enthusiasts want a dedicated Tuscany countryside excursions page with driver options.',
      recommendedAction: 'Create a new page',
      confidence: 'High'
    },
    {
      id: 'map_8',
      clusterId: 'cluster_8',
      clusterName: 'Venice Secret Canals & Murano Islands',
      primaryKeyword: 'private tour guide venice st marks and doges palace',
      secondaryKeywords: ['secret venice private walking tour off the beaten path'],
      existingPageId: 'page_6',
      existingUrl: 'https://example.com/Venice-Tours',
      existingPageTitle: 'Private Tours in Venice - Gondola, St. Marks & Hidden Canals',
      mappingStrength: 'Strong match',
      matchExplanation: 'Venice category page directly satisfies St Marks and hidden alley tour intent.',
      recommendedAction: 'Optimize existing page',
      confidence: 'High'
    },
    {
      id: 'map_9',
      clusterId: 'cluster_9',
      clusterName: 'Barcelona Gaudi & Gothic Quarter Tours',
      primaryKeyword: 'barcelona private tour guide gothic quarter',
      secondaryKeywords: ['sagrada familia and gaudi private tour with architect'],
      existingPageId: 'page_7',
      existingUrl: 'https://example.com/Barcelona-Tours',
      existingPageTitle: 'Private Barcelona Tours - Sagrada Familia, Gaudi & Tapas Walks',
      mappingStrength: 'Strong match',
      matchExplanation: 'Matches Barcelona city intent; optimize for Gaudi architectural highlights.',
      recommendedAction: 'Optimize existing page',
      confidence: 'High'
    },
    {
      id: 'map_10',
      clusterId: 'cluster_10',
      clusterName: 'London Blue Badge Historians & Cotswolds Trips',
      primaryKeyword: 'private blue badge tour guide london',
      secondaryKeywords: ['tower of london and westminster abbey private tour'],
      existingPageId: 'page_8',
      existingUrl: 'https://example.com/London-Tours',
      existingPageTitle: 'Private London Tours - British Royal History & Hidden Alleys',
      mappingStrength: 'Strong match',
      matchExplanation: 'Matches London destination searches with certified Blue Badge guide messaging.',
      recommendedAction: 'Optimize existing page',
      confidence: 'High'
    },
    {
      id: 'map_11',
      clusterId: 'cluster_11',
      clusterName: 'Civitavecchia to Rome Port Shore Excursions',
      primaryKeyword: 'civitavecchia private shore excursions to rome',
      secondaryKeywords: ['civitavecchia port to rome private tour and transfer'],
      existingPageId: 'page_10',
      existingUrl: 'https://example.com/Shore-Excursions',
      existingPageTitle: 'Private Shore Excursions for Cruise Passengers',
      mappingStrength: 'Partial match',
      matchExplanation: 'The domain has a general /Shore-Excursions page, but completely lacks specific port landing pages like /shore-excursions/civitavecchia-rome.',
      recommendedAction: 'Create a new page',
      confidence: 'High'
    },
    {
      id: 'map_12',
      clusterId: 'cluster_12',
      clusterName: 'Naples, Pompeii & Amalfi Coast Shore Excursions',
      primaryKeyword: 'naples port private shore excursion to pompeii and amalfi',
      secondaryKeywords: ['pompeii private archaeologist guide from naples port'],
      mappingStrength: 'No matching page',
      matchExplanation: 'No specific Naples cruise port shore excursion landing page exists.',
      recommendedAction: 'Create a new page',
      confidence: 'High'
    },
    {
      id: 'map_13',
      clusterId: 'cluster_13',
      clusterName: 'Kyoto Historic Temples & Shrines Hub',
      primaryKeyword: 'kyoto private tour guide ancient temples and shrines',
      secondaryKeywords: ['fushimi inari and gion private geisha quarter walk'],
      existingPageId: 'page_9',
      existingUrl: 'https://example.com/Kyoto-Tours',
      existingPageTitle: 'Private Kyoto Tours - Ancient Temples, Shrines & Geisha Quarters',
      mappingStrength: 'Strong match',
      matchExplanation: 'Strong alignment with Kyoto temple and cultural walking tour searches.',
      recommendedAction: 'Optimize existing page',
      confidence: 'High'
    },
    {
      id: 'map_14',
      clusterId: 'cluster_14',
      clusterName: 'Amsterdam Canals & Art Museums',
      primaryKeyword: 'private tour guide amsterdam canals and jordaan',
      secondaryKeywords: ['rijksmuseum and van gogh private guided art tour'],
      mappingStrength: 'No matching page',
      matchExplanation: 'Amsterdam is a major European destination, but currently lacks an indexed city hub on the domain.',
      recommendedAction: 'Create a new page',
      confidence: 'High'
    },
    {
      id: 'map_15',
      clusterId: 'cluster_15',
      clusterName: 'Athens Acropolis Archaeologist Guides',
      primaryKeyword: 'acropolis of athens private guided tour with archaeologist',
      secondaryKeywords: ['athens street food and plaka private walking tour'],
      mappingStrength: 'No matching page',
      matchExplanation: 'High search volume commercial destination with no dedicated Athens or Acropolis page.',
      recommendedAction: 'Create a new page',
      confidence: 'High'
    },
    {
      id: 'map_16',
      clusterId: 'cluster_16',
      clusterName: 'Private vs Group Tour Comparison & Tipping Guides',
      primaryKeyword: 'private vs group tours pros and cons',
      secondaryKeywords: ['how to tip private tour guide in europe', 'is a private tour guide worth the money in europe'],
      existingPageId: 'page_11',
      existingUrl: 'https://example.com/blog/private-vs-group-tours',
      existingPageTitle: 'Private Tours vs Group Tours: Which Is Better for Your Trip?',
      mappingStrength: 'Strong match',
      matchExplanation: 'Existing blog post directly satisfies this high-intent consideration query.',
      recommendedAction: 'Optimize existing page',
      confidence: 'High'
    }
  ];

  // Content gaps
  const gaps: ContentGap[] = [
    {
      id: 'gap_1',
      gapName: 'Missing Port-Specific Shore Excursion Landing Pages',
      topic: 'Shore Excursions',
      keywordClusterId: 'cluster_11',
      clusterName: 'Civitavecchia to Rome Port Shore Excursions',
      primaryKeyword: 'civitavecchia private shore excursions to rome',
      competitorsCovering: ['https://www.viator.com', 'https://www.tripadvisor.com'],
      competitorExampleUrls: [
        'https://www.viator.com/Shore-excursions-Civitavecchia/d511',
        'https://www.tripadvisor.com/Attractions-g194743-Activities-Civitavecchia.html'
      ],
      userClosestExistingPageUrl: 'https://example.com/Shore-Excursions',
      userClosestExistingPageTitle: 'Private Shore Excursions for Cruise Passengers',
      gapType: 'Missing commercial coverage',
      businessRelevance: 'Essential',
      recommendedPageType: 'Port Shore Excursions Landing Page',
      suggestedAction: 'Launch dedicated port-to-city landing pages for high-traffic cruise ports (Civitavecchia, Naples, Marseille, Dubrovnik) emphasizing timely return guarantees and direct pier pickup.',
      priority: 'High',
      evidence: 'Competitors index hundreds of port-specific landing pages and capture high-converting cruise passengers while Example Travel only hosts one generic /Shore-Excursions page.',
      confidence: 'High'
    },
    {
      id: 'gap_2',
      gapName: 'Missing Dedicated Food & Wine Category Sub-Hubs in Culinary Capitals',
      topic: 'Culinary Experiences',
      keywordClusterId: 'cluster_3',
      clusterName: 'Paris Gourmet Food & Wine Walks',
      primaryKeyword: 'private food tour paris montmartre',
      competitorsCovering: ['https://www.getyourguide.com', 'https://www.viator.com', 'https://www.withlocals.com'],
      competitorExampleUrls: [
        'https://www.getyourguide.com/paris-l16/food-tours-tc6',
        'https://www.withlocals.com/tours/france/paris/food-tours'
      ],
      userClosestExistingPageUrl: 'https://example.com/Paris-Tours',
      userClosestExistingPageTitle: 'Private Tours in Paris - Custom Paris Itineraries',
      gapType: 'Missing commercial coverage',
      businessRelevance: 'Strongly relevant',
      recommendedPageType: 'Category Sub-Hub',
      suggestedAction: 'Create dedicated culinary sub-hubs under major cities (e.g. /paris-tours/food-and-wine, /rome-tours/food-tours, /tokyo-tours/food-tours).',
      priority: 'High',
      evidence: 'Food tours represent over 25% of independent leisure travel bookings; competitors have dedicated category pages that rank for high-intent culinary search terms.',
      confidence: 'High'
    },
    {
      id: 'gap_3',
      gapName: 'Missing Dedicated Mt. Fuji & Countryside Day Trip Pages from Tokyo',
      topic: 'Tokyo Tours',
      keywordClusterId: 'cluster_5',
      clusterName: 'Tokyo Highlights & Mt Fuji Day Trips',
      primaryKeyword: 'tokyo private day trip mt fuji with driver',
      competitorsCovering: ['https://www.viator.com', 'https://www.getyourguide.com'],
      competitorExampleUrls: [
        'https://www.viator.com/Tokyo-tours/Mount-Fuji-Day-Trips/d334-g5-c89'
      ],
      userClosestExistingPageUrl: 'https://example.com/Tokyo-Tours',
      userClosestExistingPageTitle: 'Tokyo Private Tours & Day Trips with English-Speaking Guides',
      gapType: 'Missing page',
      businessRelevance: 'Essential',
      recommendedPageType: 'Day Trip Destination Page',
      suggestedAction: 'Create a dedicated /tokyo-tours/mt-fuji-day-trips landing page detailing private van transfers, English guide options, and scenic viewpoints.',
      priority: 'High',
      evidence: 'Mt. Fuji is the #1 booked day excursion out of Tokyo; competitors have dedicated sub-hubs with detailed pricing and vehicle specifications.',
      confidence: 'High'
    },
    {
      id: 'gap_4',
      gapName: 'Missing Tuscany Chauffeured Wine Tour Landing Page from Florence',
      topic: 'Florence Tours',
      keywordClusterId: 'cluster_7',
      clusterName: 'Tuscany Wine Tours from Florence',
      primaryKeyword: 'private tuscany wine tour from florence with driver',
      competitorsCovering: ['https://www.viator.com', 'https://www.getyourguide.com'],
      competitorExampleUrls: [
        'https://www.viator.com/Florence-tours/Wine-Tasting-and-Winery-Tours/d519-g6-c21'
      ],
      gapType: 'Missing commercial coverage',
      businessRelevance: 'Essential',
      recommendedPageType: 'Day Trip Destination Page',
      suggestedAction: 'Publish /florence-tours/tuscany-wine-tours targeting private wine tastings with local sommelier guides and Mercedes van drivers.',
      priority: 'High',
      evidence: 'High commercial intent with high average order value ($400-$800 per booking).',
      confidence: 'High'
    },
    {
      id: 'gap_5',
      gapName: 'Absence of Amsterdam & Athens City Hubs',
      topic: 'European Expansion',
      keywordClusterId: 'cluster_14',
      clusterName: 'Amsterdam Canals & Art Museums',
      primaryKeyword: 'private tour guide amsterdam canals and jordaan',
      competitorsCovering: ['https://www.viator.com', 'https://www.getyourguide.com', 'https://www.withlocals.com'],
      competitorExampleUrls: [
        'https://www.viator.com/Amsterdam-tours/d525',
        'https://www.getyourguide.com/amsterdam-l36'
      ],
      gapType: 'Missing topic',
      businessRelevance: 'Essential',
      recommendedPageType: 'Destination Hub Page',
      suggestedAction: 'Create structured destination hubs for Amsterdam (/amsterdam-tours) and Athens (/athens-tours) with verified local guide profiles.',
      priority: 'Medium',
      evidence: 'Both cities rank in Europe top 10 most visited tourism markets with strong demand for private art & archaeology guides.',
      confidence: 'High'
    },
    {
      id: 'gap_6',
      gapName: 'Lack of Comprehensive Tipping & Cruise Etiquette Guides',
      topic: 'Traveler Decision Framework',
      keywordClusterId: 'cluster_16',
      clusterName: 'Private vs Group Tour Comparison & Tipping Guides',
      primaryKeyword: 'how to tip private tour guide in europe',
      competitorsCovering: ['https://www.tripadvisor.com'],
      competitorExampleUrls: [
        'https://www.tripadvisor.com/Travel-g187768-s206/Italy:Tipping.Guide.html'
      ],
      userClosestExistingPageUrl: 'https://example.com/blog/private-vs-group-tours',
      userClosestExistingPageTitle: 'Private Tours vs Group Tours',
      gapType: 'Missing informational support',
      businessRelevance: 'Relevant',
      recommendedPageType: 'Supporting Guide',
      suggestedAction: 'Publish country-by-country guide on tipping etiquette for private guides in Italy, France, Japan, and Spain.',
      priority: 'Low',
      evidence: 'Captures top-of-funnel informational searches from travelers preparing for their trips and establishes brand trust.',
      confidence: 'High'
    }
  ];

  // Topical map
  const topicalMap: TopicalMapPage[] = [
    {
      id: 'tm_1',
      pageName: 'Private Tours & Local Guides Marketplace Hub',
      pageRole: 'Core Topic',
      parentTopic: 'Root',
      primaryKeyword: 'private tour guide marketplace',
      secondaryKeywords: ['hire private local tour guide', 'custom private tours worldwide'],
      searchIntent: 'Navigational',
      recommendedPageType: 'Homepage',
      status: 'Existing and properly mapped',
      isExisting: true,
      existingUrl: 'https://example.com/',
      suggestedUrl: 'https://example.com/',
      competitorsCovering: ['viator.com', 'getyourguide.com', 'withlocals.com'],
      priority: 'High',
      recommendedAction: 'Keep existing page',
      internalLinks: [
        {
          sourcePageId: 'tm_1',
          targetPageId: 'tm_2',
          targetPageName: 'Rome Private Tours Hub',
          targetUrl: 'https://example.com/Rome-Tours',
          linkRelationship: 'Child',
          suggestedAnchorText: ['Private tours in Rome', 'Rome local tour guides'],
          reasonForLink: 'Route top-level homepage authority down to primary European city pillar.'
        },
        {
          sourcePageId: 'tm_1',
          targetPageId: 'tm_3',
          targetPageName: 'Shore Excursions Hub',
          targetUrl: 'https://example.com/Shore-Excursions',
          linkRelationship: 'Child',
          suggestedAnchorText: ['Private shore excursions for cruisers', 'Port tours with on-time guarantee'],
          reasonForLink: 'Highlight major service category directly in main navigation.'
        }
      ]
    },
    {
      id: 'tm_2',
      pageName: 'Rome Private Tours Hub',
      pageRole: 'Pillar Hub',
      parentTopic: 'Italy Tours',
      primaryKeyword: 'private tour guide rome',
      secondaryKeywords: ['rome private walking tour with local', 'best private tours in rome with driver'],
      searchIntent: 'Commercial investigation',
      recommendedPageType: 'Destination Hub Page',
      status: 'Existing and properly mapped',
      isExisting: true,
      existingUrl: 'https://example.com/Rome-Tours',
      suggestedUrl: 'https://example.com/rome-tours',
      competitorsCovering: ['viator.com', 'getyourguide.com', 'withlocals.com'],
      priority: 'High',
      recommendedAction: 'Optimize existing page',
      internalLinks: [
        {
          sourcePageId: 'tm_2',
          targetPageId: 'tm_4',
          targetPageName: 'Rome Colosseum Private Tours',
          targetUrl: 'https://example.com/rome-tours/colosseum',
          linkRelationship: 'Child',
          suggestedAnchorText: ['Colosseum private guide skip the line', 'Colosseum & Roman Forum tours'],
          reasonForLink: 'Funnel commercial city visitors into high-intent landmark booking sub-page.'
        },
        {
          sourcePageId: 'tm_2',
          targetPageId: 'tm_11',
          targetPageName: 'Civitavecchia Port Shore Excursions',
          targetUrl: 'https://example.com/shore-excursions/civitavecchia-rome',
          linkRelationship: 'Related Topic',
          suggestedAnchorText: ['Arriving by cruise ship in Civitavecchia', 'Rome cruise port day excursions'],
          reasonForLink: 'Cross-link city destination hub with relevant port excursion.'
        }
      ]
    },
    {
      id: 'tm_3',
      pageName: 'Shore Excursions Hub',
      pageRole: 'Pillar Hub',
      parentTopic: 'Root',
      primaryKeyword: 'private shore excursions for cruise passengers',
      secondaryKeywords: ['back to ship guaranteed shore excursions', 'private cruise port excursions'],
      searchIntent: 'Commercial investigation',
      recommendedPageType: 'Service Landing Page',
      status: 'Existing and properly mapped',
      isExisting: true,
      existingUrl: 'https://example.com/Shore-Excursions',
      suggestedUrl: 'https://example.com/shore-excursions',
      competitorsCovering: ['viator.com', 'tripadvisor.com'],
      priority: 'High',
      recommendedAction: 'Expand existing page',
      internalLinks: [
        {
          sourcePageId: 'tm_3',
          targetPageId: 'tm_11',
          targetPageName: 'Civitavecchia Port Shore Excursions',
          targetUrl: 'https://example.com/shore-excursions/civitavecchia-rome',
          linkRelationship: 'Child',
          suggestedAnchorText: ['Civitavecchia to Rome shore tours', 'Port of Rome private driver guide'],
          reasonForLink: 'Distribute pillar equity to Mediterranean highest-traffic port.'
        },
        {
          sourcePageId: 'tm_3',
          targetPageId: 'tm_12',
          targetPageName: 'Naples, Pompeii & Amalfi Port Excursions',
          targetUrl: 'https://example.com/shore-excursions/naples-amalfi',
          linkRelationship: 'Child',
          suggestedAnchorText: ['Naples port shore excursions', 'Pompeii private guide from cruise ship'],
          reasonForLink: 'Route port traffic to top Italian cruise stops.'
        }
      ]
    },
    {
      id: 'tm_4',
      pageName: 'Rome Colosseum & Vatican Private Tours',
      pageRole: 'Commercial Destination',
      parentTopic: 'Rome Tours',
      primaryKeyword: 'hire private guide rome colosseum',
      secondaryKeywords: ['private vatican museum tour with art historian', 'colosseum underground private guide'],
      searchIntent: 'Transactional',
      recommendedPageType: 'Commercial Landing Page',
      status: 'Missing page',
      isExisting: false,
      suggestedUrl: 'https://example.com/rome-tours/colosseum-vatican',
      competitorsCovering: ['viator.com', 'getyourguide.com'],
      priority: 'High',
      recommendedAction: 'Create a new page',
      internalLinks: [
        {
          sourcePageId: 'tm_4',
          targetPageId: 'tm_2',
          targetPageName: 'Rome Private Tours Hub',
          targetUrl: 'https://example.com/Rome-Tours',
          linkRelationship: 'Parent',
          suggestedAnchorText: ['All Rome private guided tours', 'Back to Rome destination guide'],
          reasonForLink: 'Provide breadcrumb hierarchy and authority return to parent pillar.'
        }
      ]
    },
    {
      id: 'tm_5',
      pageName: 'Paris Private Food & Wine Tours',
      pageRole: 'Commercial Destination',
      parentTopic: 'Paris Tours',
      primaryKeyword: 'private food tour paris montmartre',
      secondaryKeywords: ['best paris private culinary tour', 'paris pastry and cheese private walk'],
      searchIntent: 'Commercial investigation',
      recommendedPageType: 'Category Sub-Hub',
      status: 'Existing but weak',
      isExisting: true,
      existingUrl: 'https://example.com/Paris-Tours',
      suggestedUrl: 'https://example.com/paris-tours/food-and-wine',
      competitorsCovering: ['viator.com', 'getyourguide.com', 'withlocals.com'],
      priority: 'High',
      recommendedAction: 'Create a new page',
      internalLinks: [
        {
          sourcePageId: 'tm_5',
          targetPageId: 'tm_1',
          targetPageName: 'Private Tours & Local Guides Marketplace Hub',
          targetUrl: 'https://example.com/',
          linkRelationship: 'Parent',
          suggestedAnchorText: ['Example Travel Paris private tours', 'Paris culinary local guides'],
          reasonForLink: 'Connect sub-category page back to core domain.'
        }
      ]
    },
    {
      id: 'tm_6',
      pageName: 'Tokyo Highlights & Mt Fuji Day Trips',
      pageRole: 'Commercial Destination',
      parentTopic: 'Tokyo Tours',
      primaryKeyword: 'tokyo private day trip mt fuji with driver',
      secondaryKeywords: ['hire private english speaking guide tokyo', 'custom 1 day tokyo itinerary'],
      searchIntent: 'Commercial investigation',
      recommendedPageType: 'Day Trip Destination Page',
      status: 'Missing page',
      isExisting: false,
      suggestedUrl: 'https://example.com/tokyo-tours/mt-fuji-day-trips',
      competitorsCovering: ['viator.com', 'getyourguide.com'],
      priority: 'High',
      recommendedAction: 'Create a new page',
      internalLinks: [
        {
          sourcePageId: 'tm_6',
          targetPageId: 'tm_1',
          targetPageName: 'Marketplace Hub',
          targetUrl: 'https://example.com/',
          linkRelationship: 'Parent',
          suggestedAnchorText: ['Tokyo private day tours', 'Explore Japan with private guide'],
          reasonForLink: 'Link high-value day trip endpoint to Japan pillar.'
        }
      ]
    },
    {
      id: 'tm_7',
      pageName: 'Florence & Tuscany Wine Excursions',
      pageRole: 'Commercial Destination',
      parentTopic: 'Florence Tours',
      primaryKeyword: 'private tuscany wine tour from florence with driver',
      secondaryKeywords: ['florence uffizi and accademia private guide', 'chianti private driver tour'],
      searchIntent: 'Transactional',
      recommendedPageType: 'Day Trip Destination Page',
      status: 'Missing page',
      isExisting: false,
      suggestedUrl: 'https://example.com/florence-tours/tuscany-wine-tours',
      competitorsCovering: ['viator.com', 'getyourguide.com'],
      priority: 'High',
      recommendedAction: 'Create a new page',
      internalLinks: [
        {
          sourcePageId: 'tm_7',
          targetPageId: 'tm_2',
          targetPageName: 'Rome Tours Hub',
          targetUrl: 'https://example.com/Rome-Tours',
          linkRelationship: 'Sibling',
          suggestedAnchorText: ['Combine with Rome private tour', 'Explore Italy private guides'],
          reasonForLink: 'Enable inter-city itinerary cross-selling across Italy.'
        }
      ]
    },
    {
      id: 'tm_8',
      pageName: 'Barcelona Gaudi & Gothic Quarter Walks',
      pageRole: 'Commercial Destination',
      parentTopic: 'Barcelona Tours',
      primaryKeyword: 'barcelona private tour guide gothic quarter',
      secondaryKeywords: ['sagrada familia and gaudi private tour with architect'],
      searchIntent: 'Transactional',
      recommendedPageType: 'Destination Hub Page',
      status: 'Existing and properly mapped',
      isExisting: true,
      existingUrl: 'https://example.com/Barcelona-Tours',
      suggestedUrl: 'https://example.com/barcelona-tours',
      competitorsCovering: ['viator.com', 'getyourguide.com'],
      priority: 'High',
      recommendedAction: 'Optimize existing page',
      internalLinks: []
    },
    {
      id: 'tm_9',
      pageName: 'London Blue Badge Historians Hub',
      pageRole: 'Pillar Hub',
      parentTopic: 'United Kingdom',
      primaryKeyword: 'private blue badge tour guide london',
      secondaryKeywords: ['tower of london private tour', 'cotswolds private day trip from london'],
      searchIntent: 'Commercial investigation',
      recommendedPageType: 'Destination Hub Page',
      status: 'Existing and properly mapped',
      isExisting: true,
      existingUrl: 'https://example.com/London-Tours',
      suggestedUrl: 'https://example.com/london-tours',
      competitorsCovering: ['viator.com'],
      priority: 'High',
      recommendedAction: 'Optimize existing page',
      internalLinks: []
    },
    {
      id: 'tm_10',
      pageName: 'Kyoto Ancient Temples & Gion Walks',
      pageRole: 'Commercial Destination',
      parentTopic: 'Kyoto Tours',
      primaryKeyword: 'kyoto private tour guide ancient temples and shrines',
      secondaryKeywords: ['fushimi inari and gion private geisha quarter walk'],
      searchIntent: 'Commercial investigation',
      recommendedPageType: 'Destination Hub Page',
      status: 'Existing and properly mapped',
      isExisting: true,
      existingUrl: 'https://example.com/Kyoto-Tours',
      suggestedUrl: 'https://example.com/kyoto-tours',
      competitorsCovering: ['viator.com', 'getyourguide.com'],
      priority: 'High',
      recommendedAction: 'Optimize existing page',
      internalLinks: []
    },
    {
      id: 'tm_11',
      pageName: 'Civitavecchia Port to Rome Shore Excursions',
      pageRole: 'Commercial Destination',
      parentTopic: 'Shore Excursions',
      primaryKeyword: 'civitavecchia private shore excursions to rome',
      secondaryKeywords: ['civitavecchia port to rome private tour and transfer', 'rome cruise port private driver pickup'],
      searchIntent: 'Transactional',
      recommendedPageType: 'Port Shore Excursions Landing Page',
      status: 'Missing page',
      isExisting: false,
      suggestedUrl: 'https://example.com/shore-excursions/civitavecchia-rome',
      competitorsCovering: ['viator.com', 'tripadvisor.com'],
      priority: 'High',
      recommendedAction: 'Create a new page',
      internalLinks: [
        {
          sourcePageId: 'tm_11',
          targetPageId: 'tm_3',
          targetPageName: 'Shore Excursions Hub',
          targetUrl: 'https://example.com/Shore-Excursions',
          linkRelationship: 'Parent',
          suggestedAnchorText: ['All Mediterranean cruise shore excursions', 'Return-to-ship guarantee details'],
          reasonForLink: 'Pass authority back to main shore excursion service hub.'
        }
      ]
    },
    {
      id: 'tm_12',
      pageName: 'Naples, Pompeii & Amalfi Coast Shore Excursions',
      pageRole: 'Commercial Destination',
      parentTopic: 'Shore Excursions',
      primaryKeyword: 'naples port private shore excursion to pompeii and amalfi',
      secondaryKeywords: ['pompeii private archaeologist guide from naples port', 'amalfi coast scenic drive private excursion'],
      searchIntent: 'Transactional',
      recommendedPageType: 'Port Shore Excursions Landing Page',
      status: 'Missing page',
      isExisting: false,
      suggestedUrl: 'https://example.com/shore-excursions/naples-amalfi',
      competitorsCovering: ['viator.com', 'getyourguide.com'],
      priority: 'High',
      recommendedAction: 'Create a new page',
      internalLinks: [
        {
          sourcePageId: 'tm_12',
          targetPageId: 'tm_3',
          targetPageName: 'Shore Excursions Hub',
          targetUrl: 'https://example.com/Shore-Excursions',
          linkRelationship: 'Parent',
          suggestedAnchorText: ['Browse all private cruise shore excursions'],
          reasonForLink: 'Maintain clean reciprocal linking between port landing pages and parent hub.'
        }
      ]
    },
    {
      id: 'tm_13',
      pageName: 'Amsterdam Canals & Rijksmuseum Art Tours',
      pageRole: 'Commercial Destination',
      parentTopic: 'Amsterdam Tours',
      primaryKeyword: 'private tour guide amsterdam canals and jordaan',
      secondaryKeywords: ['rijksmuseum and van gogh private guided art tour'],
      searchIntent: 'Commercial investigation',
      recommendedPageType: 'Destination Hub Page',
      status: 'Future opportunity',
      isExisting: false,
      suggestedUrl: 'https://example.com/amsterdam-tours',
      competitorsCovering: ['viator.com', 'getyourguide.com'],
      priority: 'Medium',
      recommendedAction: 'Create a new page',
      internalLinks: []
    },
    {
      id: 'tm_14',
      pageName: 'Athens Acropolis Archaeologist Tours',
      pageRole: 'Commercial Destination',
      parentTopic: 'Athens Tours',
      primaryKeyword: 'acropolis of athens private guided tour with archaeologist',
      secondaryKeywords: ['athens street food and plaka private walking tour'],
      searchIntent: 'Transactional',
      recommendedPageType: 'Destination Hub Page',
      status: 'Future opportunity',
      isExisting: false,
      suggestedUrl: 'https://example.com/athens-tours',
      competitorsCovering: ['viator.com', 'getyourguide.com'],
      priority: 'Medium',
      recommendedAction: 'Create a new page',
      internalLinks: []
    },
    {
      id: 'tm_15',
      pageName: 'Private vs Group Tours: Complete Decision Guide',
      pageRole: 'Supporting Guide',
      parentTopic: 'Travel Guides & Etiquette',
      primaryKeyword: 'private vs group tours pros and cons',
      secondaryKeywords: ['is a private tour guide worth the money in europe', 'how to choose a private tour guide'],
      searchIntent: 'Informational',
      recommendedPageType: 'Supporting Guide',
      status: 'Existing and properly mapped',
      isExisting: true,
      existingUrl: 'https://example.com/blog/private-vs-group-tours',
      suggestedUrl: 'https://example.com/blog/private-vs-group-tours',
      competitorsCovering: ['tripadvisor.com'],
      priority: 'Medium',
      recommendedAction: 'Optimize existing page',
      internalLinks: [
        {
          sourcePageId: 'tm_15',
          targetPageId: 'tm_2',
          targetPageName: 'Rome Private Tours Hub',
          targetUrl: 'https://example.com/Rome-Tours',
          linkRelationship: 'Commercial Destination',
          suggestedAnchorText: ['See private tour options in Rome', 'Book an independent local guide'],
          reasonForLink: 'Convert informational top-of-funnel readers into commercial city booking intent.'
        }
      ]
    },
    {
      id: 'tm_16',
      pageName: 'Tipping Etiquette for Private Tour Guides in Europe',
      pageRole: 'Supporting Guide',
      parentTopic: 'Travel Guides & Etiquette',
      primaryKeyword: 'how to tip private tour guide in europe',
      secondaryKeywords: ['how much to tip tour guide in italy and france', 'tipping guidelines for private drivers'],
      searchIntent: 'Informational',
      recommendedPageType: 'Supporting Guide',
      status: 'Missing page',
      isExisting: false,
      suggestedUrl: 'https://example.com/blog/tipping-private-tour-guide-europe',
      competitorsCovering: ['tripadvisor.com'],
      priority: 'Low',
      recommendedAction: 'Create a new page',
      internalLinks: [
        {
          sourcePageId: 'tm_16',
          targetPageId: 'tm_1',
          targetPageName: 'Marketplace Hub',
          targetUrl: 'https://example.com/',
          linkRelationship: 'Parent',
          suggestedAnchorText: ['Browse vetted European private guides'],
          reasonForLink: 'Drive awareness readers towards booking trusted local hosts.'
        }
      ]
    }
  ];

  return {
    project: input,
    businessProfile,
    existingPages,
    competitors,
    keywords,
    clusters,
    mappings,
    gaps,
    topicalMap,
    updatedAt: new Date().toISOString()
  };
}
