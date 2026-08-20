export type DNA = {
  energy: number;
  nightlife: number;
  nature: number;
  walkability: number;
  cost: number;
  culture: number;
  safety: number;
  weather: number;
  transit: number;
  density: number;
};

export type TimelineStop = {
  time: string;
  label: string;
  fact: string;
  sourceLabel: string;
  sourceUrl: string;
};

export type CityPortrait = {
  lead: string;
  emphasis: string;
  description: string;
};

export type City = {
  id: string;
  name: string;
  country: string;
  region: string;
  timezone: string;
  coordinates: [number, number];
  population: string;
  temperature: number;
  description: string;
  image: string;
  accent: string;
  dna: DNA;
  verifiedAt: string;
  timeline: TimelineStop[];
  portrait: CityPortrait;
};

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=85`;

const source = (
  time: string,
  label: string,
  fact: string,
  sourceLabel: string,
  sourceUrl: string,
): TimelineStop => ({ time, label, fact, sourceLabel, sourceUrl });

const verifiedAt = "2026-08-20";

export const cities: City[] = [
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    region: "Asia",
    timezone: "Asia/Tokyo",
    coordinates: [35.6762, 139.6503],
    population: "14.0M",
    temperature: 18,
    description: "Organized chaos beneath endless neon.",
    image: img("photo-1540959733332-eab4deabeeaf"),
    accent: "#f06b78",
    dna: { energy: 96, nightlife: 91, nature: 62, walkability: 89, cost: 54, culture: 97, safety: 94, weather: 72, transit: 98, density: 95 },
    portrait: {
      lead: "moves millions through pristine transit lines and serene backstreets with",
      emphasis: "engineered harmony.",
      description: "From automated train networks to tranquil neighborhood alleyways, Tokyo balances high-density urban precision with intimate everyday rituals.",
    },
    verifiedAt,
    timeline: [
      source("06:30", "The metropolis", "Tokyo is made up of 23 special wards, 26 cities, five towns and eight villages.", "GO TOKYO", "https://www.gotokyo.org/en/plan/tokyo-outline/index.html"),
      source("09:00", "Underground Tokyo", "The city's subway system covers more than 280 stations; Tokyo Metro alone runs 9 lines across 195 km.", "GO TOKYO", "https://www.gotokyo.org/en/plan/getting-around/subways/index.html"),
      source("13:00", "Tokyo Station", "Tokyo Station's red-brick building was restored to its original 1914 design.", "GO TOKYO", "https://www.gotokyo.org/en/see-and-do/attractions/"),
      source("18:30", "Kichijoji", "Kichijoji is about 15 minutes west of Shinjuku by train, pairing Harmonica Alley with stylish department stores.", "GO TOKYO", "https://www.gotokyo.org/en/see-and-do/attractions/"),
      source("22:00", "Anime districts", "Akihabara, Ikebukuro and Nakano are among Tokyo's key neighborhoods for anime and manga culture.", "GO TOKYO", "https://www.gotokyo.org/en/see-and-do/attractions/"),
      source("02:00", "Island city", "Tokyo also reaches into the Pacific through the volcanic Izu and Ogasawara Islands.", "GO TOKYO", "https://www.gotokyo.org/en/plan/tokyo-outline/index.html"),
    ],
  },
  {
    id: "santiago",
    name: "Santiago",
    country: "Chile",
    region: "South America",
    timezone: "America/Santiago",
    coordinates: [-33.4489, -70.6693],
    population: "6.8M",
    temperature: 22,
    description: "Sharp light, high peaks, restless ambition.",
    image: img("photo-1518509562904-e7ef99cdcc86"),
    accent: "#e7a84b",
    dna: { energy: 79, nightlife: 78, nature: 91, walkability: 71, cost: 72, culture: 82, safety: 69, weather: 86, transit: 80, density: 74 },
    portrait: {
      lead: "frames modern high-rises and historic barrios against the",
      emphasis: "towering Andes.",
      description: "Daily life unfolds between shaded hillside parks, mountain vistas, and lively avenues connecting centuries of architectural heritage with vibrant café culture.",
    },
    verifiedAt,
    timeline: [
      source("06:30", "Historic center", "Santiago was founded in 1541 and still anchors Chile's cultural and economic life.", "Chile Travel", "https://chile.travel/destinos/santiago-capital/"),
      source("09:00", "Andes edge", "The capital sits at the foot of the Andes, with mountain views shaping the city's horizon.", "Chile Travel", "https://chile.travel/destinos/santiago-capital/"),
      source("13:00", "City viewpoints", "Cerro San Cristóbal and Cerro Santa Lucía offer two very different ways to see Santiago from above.", "Chile Travel", "https://chile.travel/destinos/santiago-capital/"),
      source("18:30", "Maipo Valley", "Wine routes in the Maipo Valley begin close to the capital and connect urban life with Chile's winemaking tradition.", "Visit Santiago", "https://visitsantiago.travel/en/conoce-santiago/"),
      source("22:00", "Pre-Columbian memory", "The Chilean Museum of Pre-Columbian Art is one of Latin America's important collections of Indigenous art.", "Chile en el Exterior", "https://www.chile.gob.cl/chile/sobre-chile/informacion-turistica/turismo/turismo"),
      source("02:00", "Market streets", "Mercado Central and Santiago's historic neighborhoods keep food, heritage and everyday city life close together.", "Chile Travel", "https://chile.travel/destinos/santiago-capital/"),
    ],
  },
  {
    id: "new-york",
    name: "New York",
    country: "United States",
    region: "North America",
    timezone: "America/New_York",
    coordinates: [40.7128, -74.006],
    population: "8.3M",
    temperature: 16,
    description: "Every block believes it is the center.",
    image: img("photo-1522083165195-3424ed129620"),
    accent: "#e2dc74",
    dna: { energy: 99, nightlife: 96, nature: 55, walkability: 93, cost: 28, culture: 98, safety: 72, weather: 66, transit: 89, density: 94 },
    portrait: {
      lead: "powers 24-hour street life and iconic brownstones with",
      emphasis: "unmatched density.",
      description: "A city engineered for constant movement, where round-the-clock subways, pocket parks, and bustling neighborhood blocks turn every corner into a public stage.",
    },
    verifiedAt,
    timeline: [
      source("06:30", "Five boroughs", "More than 8 million people live across New York City's five boroughs.", "NYC.gov", "https://www.nyc.gov/main/your-government"),
      source("09:00", "The subway pulse", "The subway runs 24/7, and 57% of workers commute by public transportation according to the city's quality-of-life overview.", "NYC.gov", "https://www.nyc.gov/site/internationalbusiness/why-nyc/quality-of-life.page"),
      source("13:00", "Landmark city", "New York protects more than 38,000 landmarked buildings and 157 historic districts.", "NYC Landmarks", "https://www.nyc.gov/site/lpc/discover/discover.page"),
      source("18:30", "Green room", "Parks and public spaces cover about 14% of the city, adding up to nearly 30,000 acres.", "NYC.gov", "https://www.nyc.gov/site/internationalbusiness/why-nyc/quality-of-life.page"),
      source("22:00", "Public by design", "More than 590 privately owned public spaces offer over 3.8 million square feet of open space across the city.", "NYC.gov", "https://www.nyc.gov/pops"),
      source("02:00", "Civic skyline", "New York's Municipal Building was the first US government building constructed directly over a working subway line.", "Centre 360", "https://www.nyc.gov/centre360"),
    ],
  },
  {
    id: "barcelona",
    name: "Barcelona",
    country: "Spain",
    region: "Europe",
    timezone: "Europe/Madrid",
    coordinates: [41.3874, 2.1686],
    population: "1.7M",
    temperature: 24,
    description: "Sea air, long lunches and radical geometry.",
    image: img("photo-1539037116277-4db20889f2d4"),
    accent: "#f0a25d",
    dna: { energy: 88, nightlife: 93, nature: 80, walkability: 92, cost: 68, culture: 94, safety: 78, weather: 93, transit: 86, density: 84 },
    portrait: {
      lead: "blends modernist grid blocks with sunlit Mediterranean",
      emphasis: "coastal living.",
      description: "From Gaudí's expressive architecture in Eixample to beachfront promenades and market stalls, the city is designed around outdoor living and shared public squares.",
    },
    verifiedAt,
    timeline: [
      source("06:30", "Mediterranean city", "Barcelona combines a Mediterranean seafront with a dense, cosmopolitan urban center.", "Spain Official Tourism", "https://www.spain.info/en/destination/barcelona/"),
      source("09:00", "Gaudí's geometry", "Gaudí's Sagrada Família, Park Güell, Casa Batlló and La Pedrera shape the city's instantly recognizable visual language.", "Spain Official Tourism", "https://www.spain.info/en/destination/barcelona/"),
      source("13:00", "Market streets", "La Boqueria and Barcelona's traditional markets connect everyday food culture with the city's tourist routes.", "Spain Official Tourism", "https://www.spain.info/en/destination/barcelona/"),
      source("18:30", "Green climbs", "Montjuïc, Ciutadella Park, the marina and the Olympic Village give the city several different outdoor rhythms.", "Spain Official Tourism", "https://www.spain.info/en/destination/barcelona/"),
      source("22:00", "The Liceu", "The Gran Teatre del Liceu is one of Spain's leading opera houses and a major part of Barcelona's cultural agenda.", "Spain Official Tourism", "https://www.spain.info/en/destination/barcelona/"),
      source("02:00", "Tourism at scale", "Barcelona's visitor economy attracts around 30 million visitors a year and supports more than 155,000 jobs.", "Barcelona City Council", "https://ajuntament.barcelona.cat/turisme/es/inicio"),
    ],
  },
  {
    id: "amsterdam",
    name: "Amsterdam",
    country: "Netherlands",
    region: "Europe",
    timezone: "Europe/Amsterdam",
    coordinates: [52.3676, 4.9041],
    population: "0.9M",
    temperature: 14,
    description: "Human-scale living, reflected in water.",
    image: img("photo-1534351590666-13e3e96b5017"),
    accent: "#e59b73",
    dna: { energy: 78, nightlife: 84, nature: 76, walkability: 96, cost: 43, culture: 92, safety: 88, weather: 58, transit: 92, density: 77 },
    portrait: {
      lead: "flows along historic canals, brick bridges, and",
      emphasis: "seamless bike paths.",
      description: "Built at human scale on thousands of wooden piles, daily routines move by bicycle alongside 17th-century canal rings and modern waterfront housing.",
    },
    verifiedAt,
    timeline: [
      source("06:30", "Built on water", "Amsterdam's streets and buildings stand on thousands of wooden piles driven into the ground.", "City of Amsterdam", "https://www.amsterdam.nl/stad-ontwikkeling/the-city-model-amsterdam/city-full-of-remarkable-places/"),
      source("09:00", "Eight centuries", "The city's official visitor guide traces more than 800 years of history through canals, courtyards and medieval buildings.", "I amsterdam", "https://www.iamsterdam.com/en/see-and-do/attractions-and-sights"),
      source("13:00", "Museum city", "The I amsterdam City Card opens access to more than 70 museums, attractions and activities.", "I amsterdam", "https://www.iamsterdam.com/en/see-and-do/attractions-and-sights"),
      source("18:30", "Canal rhythm", "A historic canal cruise is included in the City Card, making the water network part of the everyday visitor route.", "I amsterdam", "https://www.iamsterdam.com/en/see-and-do/attractions-and-sights"),
      source("22:00", "A city of contrasts", "Historic churches and canal houses sit beside contemporary landmarks such as the Eye Filmmuseum and Sluishuis.", "City of Amsterdam", "https://www.amsterdam.nl/stad-ontwikkeling/the-city-model-amsterdam/city-full-of-remarkable-places/"),
      source("02:00", "Tourism in balance", "Amsterdam's 2026 visitor-economy plan includes halving river cruises and spreading visitors more evenly across the city.", "City of Amsterdam", "https://www.amsterdam.nl/en/policy/tourism/"),
    ],
  },
  {
    id: "seoul",
    name: "Seoul",
    country: "South Korea",
    region: "Asia",
    timezone: "Asia/Seoul",
    coordinates: [37.5665, 126.978],
    population: "9.4M",
    temperature: 19,
    description: "Ancient rhythm at broadband speed.",
    image: img("photo-1555425293-16e3d1e49b85"),
    accent: "#9e84ef",
    dna: { energy: 95, nightlife: 94, nature: 73, walkability: 85, cost: 62, culture: 93, safety: 92, weather: 68, transit: 97, density: 92 },
    portrait: {
      lead: "layers centuries of royal pavilions beneath",
      emphasis: "high-speed transit.",
      description: "Joseon palaces and futuristic architecture coexist along hyper-connected metro corridors, 24-hour markets, and bustling design districts.",
    },
    verifiedAt,
    timeline: [
      source("06:30", "Royal Seoul", "Gyeongbokgung and Changdeokgung preserve the spaces where Joseon kings once walked.", "Visit Seoul", "https://english.visitseoul.net/AboutSeoul"),
      source("09:00", "Past and present", "Traditional palaces and modern skyscrapers can appear within just a few steps of each other in Seoul.", "Visit Seoul", "https://english.visitseoul.net/AboutSeoul"),
      source("13:00", "Museum capital", "The National Museum of Korea, MMCA and Leeum are part of the city's dense mix of traditional and contemporary art.", "Visit Seoul", "https://english.visitseoul.net/AboutSeoul"),
      source("18:30", "Hongdae energy", "Hongdae is one of the places where Seoul's youth culture, music and trend-driven street life become visible.", "Visit Seoul", "https://english.visitseoul.net/AboutSeoul"),
      source("22:00", "K Culture", "Seoul is a global hub for K-pop, K-drama, K-beauty and K-food—the four currents of its modern cultural export.", "Visit Seoul", "https://english.visitseoul.net/AboutSeoul"),
      source("02:00", "A living archive", "Seoul's current identity is built around coexistence: a thousand years of tradition beside one of Asia's fastest-moving urban scenes.", "Visit Seoul", "https://english.visitseoul.net/AboutSeoul"),
    ],
  },
  {
    id: "singapore",
    name: "Singapore",
    country: "Singapore",
    region: "Asia",
    timezone: "Asia/Singapore",
    coordinates: [1.3521, 103.8198],
    population: "5.9M",
    temperature: 30,
    description: "A tropical future engineered with precision.",
    image: img("photo-1525625293386-3f8f99389edd"),
    accent: "#5bd5b0",
    dna: { energy: 86, nightlife: 76, nature: 84, walkability: 82, cost: 42, culture: 88, safety: 98, weather: 74, transit: 96, density: 90 },
    portrait: {
      lead: "integrates vertical greenery and canopy gardens into",
      emphasis: "modern urbanism.",
      description: "A model of biophilic architecture and pedestrian connectivity, where UNESCO-recognized hawker centers sit steps away from climate-controlled glass domes and shaded garden walkways.",
    },
    verifiedAt,
    timeline: [
      source("06:30", "Garden city", "Singapore's tropical identity is woven into its parks, gardens and dense green public spaces.", "Visit Singapore", "https://www.visitsingapore.com/see-do-singapore/"),
      source("09:00", "Botanic heritage", "The Singapore Botanic Gardens is the country's first UNESCO World Heritage Site.", "UNESCO", "https://whc.unesco.org/en/list/1483/"),
      source("13:00", "Hawker culture", "Hawker culture in Singapore is recognized by UNESCO as community dining rooted in a multicultural city.", "UNESCO", "https://ich.unesco.org/en/RL/hawker-culture-in-singapore-community-dining-and-culinary-practices-in-a-multicultural-urban-context-01568"),
      source("18:30", "Supertree skyline", "Gardens by the Bay turns horticulture into architecture with its vertical Supertree Grove.", "Visit Singapore", "https://www.visitsingapore.com/see-do-singapore/"),
      source("22:00", "Many cultures, one island", "Singapore's food, neighborhoods and festivals reflect a city shaped by Chinese, Malay, Indian and many other traditions.", "Visit Singapore", "https://www.visitsingapore.com/see-do-singapore/"),
      source("02:00", "Tropical urbanism", "The city-state's defining tension is compact and metropolitan on one side, humid and botanical on the other.", "Visit Singapore", "https://www.visitsingapore.com/see-do-singapore/"),
    ],
  },
  {
    id: "reykjavik",
    name: "Reykjavík",
    country: "Iceland",
    region: "Europe",
    timezone: "Atlantic/Reykjavik",
    coordinates: [64.1466, -21.9426],
    population: "0.14M",
    temperature: 7,
    description: "Small-city warmth at the edge of the wild.",
    image: img("photo-1529963183134-61a90db47eaf"),
    accent: "#8ed8e8",
    dna: { energy: 57, nightlife: 72, nature: 99, walkability: 77, cost: 31, culture: 79, safety: 97, weather: 42, transit: 55, density: 36 },
    portrait: {
      lead: "anchors cozy geothermal neighborhoods against",
      emphasis: "subarctic nature.",
      description: "Colorful low-rise homes, communal geothermal swimming pools, and harborside literary cafés define daily life in the world's northernmost capital.",
    },
    verifiedAt,
    timeline: [
      source("06:30", "Small capital", "Nearly two-thirds of Iceland's residents live in the Reykjavík capital area.", "Visit Reykjavík", "https://visitreykjavik.is/11-little-known-facts-about-reykjavik"),
      source("09:00", "City of Literature", "Reykjavík became a UNESCO City of Literature in 2011, honoring its saga and contemporary writing traditions.", "Visit Reykjavík", "https://visitreykjavik.is/11-little-known-facts-about-reykjavik"),
      source("13:00", "Northern capital", "Reykjavík is the world's northernmost capital city of a sovereign state.", "Visit Reykjavík", "https://visitreykjavik.is/11-little-known-facts-about-reykjavik"),
      source("18:30", "Culture on a small scale", "The city has more than 60 museums, exhibition spaces and galleries across its compact center.", "Visit Reykjavík", "https://visitreykjavik.is/reykjavik-something-everyone"),
      source("22:00", "The dog ban", "Dogs were banned from living in Reykjavík for around 60 years, beginning in 1924.", "Visit Reykjavík", "https://visitreykjavik.is/11-little-known-facts-about-reykjavik"),
      source("02:00", "Geothermal nights", "Geothermal-heated pools are part of Reykjavík's everyday culture, not just a visitor attraction.", "Visit Reykjavík", "https://visitreykjavik.is/index.php/news/ten-fascinating-facts-about-reykjavik"),
    ],
  },
  {
    id: "buenos-aires",
    name: "Buenos Aires",
    country: "Argentina",
    region: "South America",
    timezone: "America/Argentina/Buenos_Aires",
    coordinates: [-34.6037, -58.3816],
    population: "3.1M",
    temperature: 23,
    description: "Melancholy, theatre and midnight tables.",
    image: img("photo-1589909202802-8f4aadce1849"),
    accent: "#83c6e5",
    dna: { energy: 89, nightlife: 96, nature: 67, walkability: 88, cost: 86, culture: 96, safety: 65, weather: 84, transit: 78, density: 86 },
    portrait: {
      lead: "sprawls across wide avenues, leafy plazas, and",
      emphasis: "midnight cafés.",
      description: "European-style boulevards and neighborhood milongas create an everyday lifestyle centered around historic corner bistros, open bookshops, and leisurely sidewalk conversations.",
    },
    verifiedAt,
    timeline: [
      source("06:30", "Tango city", "Buenos Aires is presented by Argentina's official tourism portal as a place where tango is felt at its source.", "Argentina Travel", "https://www.argentina.travel/buenos-aires/caba"),
      source("09:00", "Café Tortoni", "Café Tortoni is recognized by the city's official tourism guide as Buenos Aires' oldest café.", "Buenos Aires Tourism", "https://turismo.buenosaires.gob.ar/en/recorrido/must-see-attractions"),
      source("13:00", "Teatro Colón", "Teatro Colón is celebrated for both its architecture and its acoustics, making it one of the city's defining cultural spaces.", "Buenos Aires Tourism", "https://turismo.buenosaires.gob.ar/en/recorrido/must-see-attractions"),
      source("18:30", "Caminito", "Caminito turns a colorful stretch of La Boca into an open-air street museum.", "Buenos Aires Tourism", "https://turismo.buenosaires.gob.ar/en/recorrido/must-see-attractions"),
      source("22:00", "A bookstore in a theatre", "El Ateneo Grand Splendid occupies a former theatre and is now one of the world's most distinctive bookstores.", "Buenos Aires Tourism", "https://turismo.buenosaires.gob.ar/en/recorrido/must-see-attractions"),
      source("02:00", "A city of late tables", "The city's official travel guide describes a culture of cafés, football, tango, libraries and nightlife that keeps the streets moving after dark.", "Argentina Travel", "https://www.argentina.travel/buenos-aires/caba"),
    ],
  },
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    region: "Europe",
    timezone: "Europe/London",
    coordinates: [51.5072, -0.1276],
    population: "8.9M",
    temperature: 13,
    description: "Centuries of stories, always in motion.",
    image: img("photo-1513635269975-59663e0ac1ad"),
    accent: "#cf7272",
    dna: { energy: 91, nightlife: 91, nature: 72, walkability: 88, cost: 32, culture: 99, safety: 76, weather: 55, transit: 93, density: 88 },
    portrait: {
      lead: "links centuries of civic landmarks across",
      emphasis: "sprawling green parks.",
      description: "A mosaic of distinct urban villages connected by the Underground, where historic brick mews, world-class cultural institutions, and vast royal parklands meet.",
    },
    verifiedAt,
    timeline: [
      source("06:30", "Roman foundations", "London began as a Roman trading and administrative settlement around AD 43.", "Visit London", "https://www.visitlondon.com/blog/facts-about-london"),
      source("09:00", "National Park City", "London became the world's first National Park City in July 2019.", "Visit London", "https://www.visitlondon.com/blog/facts-about-london"),
      source("13:00", "Four UNESCO sites", "London has four UNESCO World Heritage Sites, including the Tower of London, Greenwich and Kew Gardens.", "London City Hall", "https://www.london.gov.uk/programmes-strategies/arts-and-culture/vision-and-strategy/20-facts-about-london%E2%80%99s-culture"),
      source("18:30", "Many Londons", "More than 300 languages are spoken in London, making its cultural mix one of the city's defining facts.", "London City Hall", "https://www.london.gov.uk/programmes-strategies/arts-and-culture/vision-and-strategy/20-facts-about-london%E2%80%99s-culture"),
      source("22:00", "Theatre city", "London hosts more than 22,000 music performances a year across more than 300 venues.", "London City Hall", "https://www.london.gov.uk/programmes-strategies/arts-and-culture/vision-and-strategy/20-facts-about-london%E2%80%99s-culture"),
      source("02:00", "A very old skyline", "The Temple of Mithras, London's oldest building, dates to around AD 240.", "Visit London", "https://www.visitlondon.com/blog/facts-about-london"),
    ],
  },
  {
    id: "copenhagen",
    name: "Copenhagen",
    country: "Denmark",
    region: "Europe",
    timezone: "Europe/Copenhagen",
    coordinates: [55.6761, 12.5683],
    population: "0.65M",
    temperature: 12,
    description: "Quiet confidence, designed around people.",
    image: img("photo-1513622470522-26c3c8a854bc"),
    accent: "#da8095",
    dna: { energy: 70, nightlife: 79, nature: 83, walkability: 94, cost: 35, culture: 90, safety: 95, weather: 54, transit: 91, density: 70 },
    portrait: {
      lead: "designs everyday life around clean waterways and",
      emphasis: "cycling infrastructure.",
      description: "Quiet residential streets, harbor baths, and world-renowned public design combine to create an effortless urban flow built entirely around human well-being.",
    },
    verifiedAt,
    timeline: [
      source("06:30", "Viking roots", "Copenhagen's history reaches back to the Viking Age and one of the world's oldest monarchies.", "Visit Copenhagen", "https://www.visitcopenhagen.com/things-to-do"),
      source("09:00", "Airport to center", "The city's metro connects Copenhagen Airport with the center in about 15 minutes.", "City of Copenhagen", "https://international.kk.dk/about-copenhagen/copenhagen-facts"),
      source("13:00", "Life in the saddle", "Copenhagen's official visitor guide describes bicycle riding as part of everyday city life.", "Visit Copenhagen", "https://www.visitcopenhagen.com/things-to-do"),
      source("18:30", "Harbor baths", "Public harbor baths and green parks make the waterfront part of Copenhagen's daily recreation.", "Visit Copenhagen", "https://www.visitcopenhagen.com/things-to-do"),
      source("22:00", "A compact culture", "Historic sites, art scenes and modern museums sit close enough to combine in a single city day.", "Visit Copenhagen", "https://www.visitcopenhagen.com/things-to-do"),
      source("02:00", "CopenPay", "CopenPay rewards visitors for small sustainable actions with free perks, discounts and local experiences.", "Visit Copenhagen", "https://www.visitcopenhagen.com/things-to-do"),
    ],
  },
  {
    id: "sydney",
    name: "Sydney",
    country: "Australia",
    region: "Oceania",
    timezone: "Australia/Sydney",
    coordinates: [-33.8688, 151.2093],
    population: "5.3M",
    temperature: 25,
    description: "Bright horizons and life lived outside.",
    image: img("photo-1506973035872-a4ec16b8e8d9"),
    accent: "#5cb7e7",
    dna: { energy: 80, nightlife: 77, nature: 95, walkability: 76, cost: 39, culture: 87, safety: 89, weather: 94, transit: 74, density: 68 },
    portrait: {
      lead: "embraces natural ocean bays and coastal walks with",
      emphasis: "sun-drenched energy.",
      description: "Ferries connect sparkling harbor precincts to coastal trails and ocean pools, merging relaxed outdoor leisure with a dynamic financial center.",
    },
    verifiedAt,
    timeline: [
      source("06:30", "Harbor city", "Sydney's urban geography fans out from the harbor toward Bondi Beach, Palm Beach and the west.", "Sydney.com", "https://www.sydney.com/uk/destinations"),
      source("09:00", "Oldest national park", "The city's southern edge reaches toward Australia's oldest national park.", "Sydney.com", "https://www.sydney.com/uk/destinations"),
      source("13:00", "Circular Quay", "The Sydney Opera House sits near Circular Quay, where trains, ferries and buses meet beside the harbor.", "Sydney.com", "https://www.sydney.com/uk/destinations"),
      source("18:30", "A multicultural city", "Sydney is described by its official tourism guide as one of the world's most multicultural cities.", "Sydney.com", "https://www.sydney.com/uk/destinations"),
      source("22:00", "Life outdoors", "Beaches, harbor walks and public transport to the waterfront make outdoor time part of Sydney's everyday rhythm.", "City of Sydney", "https://www.cityofsydney.nsw.gov.au/sydney-visitors-guide"),
      source("02:00", "Culture and sport", "Sydney's identity mixes Indigenous and migrant heritage with a strong passion for arts and sport.", "Sydney.com", "https://www.sydney.com/uk/destinations"),
    ],
  },
];

export const dnaLabels: Record<keyof DNA, string> = {
  energy: "Energy",
  nightlife: "Nightlife",
  nature: "Nature",
  walkability: "Walkability",
  cost: "Affordability",
  culture: "Culture",
  safety: "Safety",
  weather: "Weather",
  transit: "Transit",
  density: "Density",
};

export const getCity = (id: string) => cities.find((c) => c.id === id) || cities[0];
