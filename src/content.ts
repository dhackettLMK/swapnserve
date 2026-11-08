// Press room content for Swap 'N' Serve. All copy is final: edit facts here only.

export const CONTACT = {
  name: "David Hackett",
  role: "Founder, Swap 'N' Serve",
  email: "d.hackett2005@gmail.com",
  website: "swapnserve.com",
  note: "Available for interviews, photos and on-the-day media access on request.",
};

export const STANDFIRST =
  "A 20-year-old from Raheen says Limerick City is sitting on a goldmine of young talent that nobody is backing. For his next event, he's put 17 of them to work.";

export const ONE_LINER =
  "20-year-old Limerick entrepreneur David Hackett is using his Swap 'N' Serve Cup, a community football tournament on 5 December 2026, to spotlight the young people Limerick City is overlooking.";

export const STORY_IN_BRIEF = [
  "David Hackett is a 20-year-old entrepreneur from Raheen in Limerick City and the founder of Swap 'N' Serve, a youth-led community nonprofit that collects and redistributes clothing for free. He was the first in his family to go to college, left after one year to build full-time, and became the first Web Summit Scholar from Limerick and Munster.",
  "He believes Limerick City is full of talent that is overlooked and underequipped: comedians with millions of views, footballers trialling abroad, musicians, designers, founders and community volunteers who rarely get recognised. On Saturday 5 December 2026 he is hosting the Swap 'N' Serve Cup, a 5-a-side football tournament with food, live music and entertainment, uniting Limerick against hate and discrimination. Over €2,500 will be given back to the community. Every person helping to deliver it is from Limerick, and this site introduces them.",
];

export const BOILERPLATE =
  "Swap 'N' Serve is a youth-led community nonprofit in Limerick, founded in August 2025 by David Hackett. It runs free clothing redistribution events and community projects, and has redistributed over 2,500 clothing items with the help of 85+ volunteers and 600+ attendees across two events. Its partners include the University of Limerick, TUS, Tusla and local charities.";

export const KEY_FACTS = [
  "Over €2,500 given back: €1,500 cash prize for the winning team and €1,000 in donated equipment for the host club",
  "5-a-side tournament, teams of 7, €10 per player, with all proceeds funding the next free clothing event",
  "17 young Limerick people involved in delivering the event",
  "Swap 'N' Serve to date: 2,500+ clothing items redistributed, 85+ volunteers, 600+ attendees across two events",
  "Partners include UL, TUS, Tusla and local charities",
  "Live music and poetry from local performers on the day, plus a poetry workshop and open mic",
];

export const QUOTES = [
  {
    text: "Limerick is sitting on a goldmine of talent that is overlooked and underequipped. Swap 'N' Serve exists to change that.",
    attribution: "David Hackett, founder, Swap 'N' Serve",
  },
  {
    text: "Every person involved in this event is from Limerick City. You do not have to leave here to find world-class people, you only have to look.",
    attribution: "David Hackett, founder, Swap 'N' Serve",
  },
  {
    text: "The Cup is only the start. Huge change is coming to this city and young people are going to be the ones leading it. I'm here now.",
    attribution: "David Hackett, founder, Swap 'N' Serve",
  },
];

export const CUP_EVENT = {
  name: "The Swap 'N' Serve Cup",
  what: "a 5-a-side community football tournament with food, live music and entertainment, uniting Limerick against hate and discrimination",
  date: "Saturday 5 December 2026, 3pm",
  dateISO: "2026-12-05T15:00:00+00:00",
  where: "Summerville Rovers F.C., 124 Ballinacurra Gardens, Ballinacurra (Weston), Limerick, V94 R98D",
  enter: "swapnserve.com/cup (teams of 7, €10 per player)",
  prizes: "€1,500 cash for the winning team and €1,000 in donated equipment for the host club",
  media: "Media welcome on the day, with interviews and photos available on request",
  programme: ["Football", "Food", "Live music", "Poetry workshop", "Open mic"],
};

export type PersonCategory =
  | "Entertainers"
  | "Sport"
  | "Music & Arts"
  | "Business & Media"
  | "Community";

export const PERSON_CATEGORIES: PersonCategory[] = [
  "Entertainers",
  "Sport",
  "Music & Arts",
  "Business & Media",
  "Community",
];

export interface PersonLink {
  label: string;
  url: string;
}

export interface Person {
  slug: string;
  name: string;
  role: string;
  area: string;
  category: PersonCategory;
  hook: string;
  bio: string[];
  whyChosen?: string;
  roleInCup: string;
  links: PersonLink[];
  organiser?: boolean;
}

export const PEOPLE: Person[] = [
  {
    slug: "david-hackett",
    name: "David Hackett",
    role: "Founder, Swap 'N' Serve",
    area: "Raheen",
    category: "Business & Media",
    hook: "First Web Summit Scholar from Limerick and Munster.",
    bio: [
      "David was the first in his family to go to college. He left after a year to build full-time, and founded Swap 'N' Serve in August 2025.",
      "He has said publicly that he intends to be the greatest entrepreneur in the world before 30, and that he wants to do it from Limerick.",
    ],
    roleInCup: "Organiser of the Swap 'N' Serve Cup.",
    links: [],
    organiser: true,
  },
  {
    slug: "ben-oshaughnessy",
    name: "Ben O'Shaughnessy",
    role: "Entertainer",
    area: "Rathbane",
    category: "Entertainers",
    hook: "A TikTok comedian with 4 million views who David thinks could have his own TV show.",
    bio: [
      "Ben has 20,000 followers, 4 million views and 400,000 likes on TikTok.",
      "\"Ben is one of the purest and funniest people I've had the pleasure of meeting. Given the right opportunities he could run his own TV show and become a national hero.\"",
    ],
    roleInCup:
      "Creating promotional videos and connecting Swap 'N' Serve with local restaurants and businesses.",
    links: [{ label: "TikTok", url: "https://www.tiktok.com/@benoshaugnessy" }],
  },
  {
    slug: "darren-nwankwo",
    name: "Darren Nwankwo",
    role: "Footballer",
    area: "Raheen",
    category: "Sport",
    hook: "A Treaty United centre back who has trialled with Blackburn Rovers and Lecce.",
    bio: [
      "Darren plays centre back for Treaty United and has been on trial with Blackburn Rovers in England and Lecce in Italy.",
      "\"A lovely, kind, generous person and a great role model for the kids who look up to him.\"",
    ],
    roleInCup: "Logistics, promotion and marketing.",
    links: [
      {
        label: "Club page",
        url: "https://treatyunitedfc.com/player/darren-nwankwo/",
      },
    ],
  },
  {
    slug: "tamera-keogh",
    name: "Tamera Keogh",
    role: "Arts Creator",
    area: "Raheen",
    category: "Music & Arts",
    hook: "The designer who made David's Michael Jackson replica glove.",
    bio: [
      "Tamera is a local creative who designed and made the Michael Jackson replica glove David wears in his press photos.",
      "\"Her creative work is appreciated by everyone who sees it and deserves far wider recognition.\"",
    ],
    roleInCup: "Creative and design support.",
    links: [],
  },
  {
    slug: "excel-ahmed",
    name: "Excel Ahmed",
    role: "Musician",
    area: "Raheen",
    category: "Music & Arts",
    hook: "A musician and poet, nominated for Live 95's 'New Local Hero' wildcard award, who is performing on the day.",
    bio: [
      "Excel is a musician and poet who has released music and poetry and was nominated for Live 95's 'New Local Hero' wildcard award. He also volunteers as a coach for his little brother's team at Regional United.",
    ],
    roleInCup:
      "Advising on logistics and event organisation, and performing live on the day.",
    links: [
      {
        label: "Press",
        url: "https://www.live95fm.ie/news/entertainment/limerick-musician-needs-your-vote-as-new-local-hero-wildcard-award-announced/",
      },
    ],
  },
  {
    slug: "sean-leddin",
    name: "Sean Leddin",
    role: "Founder & CEO, Fíor Jewellery",
    area: "South Circular Road",
    category: "Business & Media",
    hook: "Built an Irish-themed jewellery brand into a business reported at €1m.",
    bio: [
      "Sean founded Fíor Jewellery, an Irish-themed jewellery brand stocked across Ireland with its own shop in the Crescent Shopping Centre.",
      "\"Sean has been a phenomenal ally to Swap 'N' Serve, with financial support and advice on key decisions.\"",
    ],
    roleInCup: "Financial support and strategic advice.",
    links: [
      {
        label: "Press",
        url: "https://www.thesun.ie/money/16962586/college-business-side-hustle-jewellery-million-successful/",
      },
    ],
  },
  {
    slug: "oluchi-okoli",
    name: "Oluchi Okoli",
    role: "Activist",
    area: "Caherdavin",
    category: "Community",
    hook: "A core Swap 'N' Serve member and an advocate for reform of the foster care system.",
    bio: [
      "Oluchi has spoken publicly about reforming the foster care system.",
      "\"Oluchi has stayed resilient, kind and loving to everyone. Without her the organisation wouldn't run as smoothly.\"",
    ],
    roleInCup:
      "Core team member. She brought the Tusla group into the last Swap 'N' Serve project.",
    links: [
      {
        label: "Press",
        url: "https://www.independent.ie/county/limerick/limerick-student-calls-for-reform-of-foster-care-system-after-childhood-in-care/a/146226370.html",
      },
    ],
  },
  {
    slug: "ryan-beni-dijopang",
    name: "Ryan Beni Dijopang",
    role: "Model",
    area: "Ballinacurra Weston",
    category: "Music & Arts",
    hook: "A streetwear model who styles the look of the whole project.",
    bio: ["Ryan is a model known for his streetwear outfits."],
    roleInCup:
      "Styling advice and shaping the visual aesthetic of the organisation and the event.",
    links: [],
  },
  {
    slug: "ikeaka-akwajah",
    name: "Ikeaka Akwajah (\"Ahukatoofunny\")",
    role: "Entertainer",
    area: "Castletroy",
    category: "Entertainers",
    hook: "100 million views on TikTok.",
    bio: [
      "Ikeaka has over 100 million views, 100,000 followers and 12 million likes on TikTok as Ahukatoofunny.",
      "\"A lovely, kind, generous young man.\"",
    ],
    roleInCup: "Promotion and marketing.",
    links: [{ label: "TikTok", url: "https://www.tiktok.com/@ahukatoofunny" }],
  },
  {
    slug: "craig-dawson",
    name: "Craig Dawson",
    role: "Community Pillar",
    area: "Southill",
    category: "Community",
    hook: "A Southill volunteer planning to study youth work.",
    bio: [
      "Craig wants to be a pillar of his community and plans to study youth work in college so he can help bring life back to Limerick. He volunteers widely in Southill.",
      "\"Craig treats everyone very well.\"",
    ],
    roleInCup: "Logistics and event management.",
    links: [],
  },
  {
    slug: "azeezat-muniru",
    name: "Azeezat Muniru",
    role: "Community Pillar",
    area: "Annacotty",
    category: "Music & Arts",
    hook: "A UL architecture student who runs Aze's Room, an open mic for local creatives.",
    bio: [
      "Azeezat studies Architecture at UL. In her spare time she runs Aze's Room, an open mic that gives local creatives, musicians and poets a stage and an audience.",
      "\"One of the most talented people I have had the pleasure of meeting.\"",
    ],
    roleInCup: "Running the poetry workshop and open mic on the day.",
    links: [
      {
        label: "Press",
        url: "https://limerickvoice.com/arts-and-culture/azes-room-open-mic-limerick/",
      },
    ],
  },
  {
    slug: "chris-oconnor",
    name: "Chris O'Connor",
    role: "Volunteer",
    area: "Raheen",
    category: "Community",
    hook: "Ran from Limerick to his late father's grave in Cork.",
    bio: [
      "Since his father passed away, Chris has run multiple marathons, run from Limerick to his father's grave in Cork, and committed himself to community volunteering, including cleaning up Limerick's road signs.",
    ],
    roleInCup: "Volunteering his free time on logistics.",
    links: [
      {
        label: "Press",
        url: "https://www.limerickleader.ie/news/young-entrepreneurs-are-cleaning-up-limerick-city-one-road-sign-at-a-time-9047164",
      },
    ],
  },
  {
    slug: "shekinah-makere",
    name: "Shekinah Makere",
    role: "Aspiring Chef",
    area: "Raheen",
    category: "Community",
    hook: "A teenage volunteer cooking for the Cup who dreams of opening her own restaurant.",
    bio: [
      "Shekinah has volunteered with Swap 'N' Serve since its second event and is now taking on a more senior role. She hopes to open her own restaurant in Limerick one day.",
    ],
    roleInCup: "Catering food on the day.",
    links: [],
  },
  {
    slug: "ncube-brothers",
    name: "Mduduzi & Valentino Ncube",
    role: "Students",
    area: "Castletroy",
    category: "Community",
    hook: "Two brothers who have been fundamental to Swap 'N' Serve's growth.",
    bio: [
      "Two young brothers who are talented in sport and academics. They give a lot of their spare time to their church and to Swap 'N' Serve.",
      "\"They have been a fundamental part of the organisation's growth.\"",
    ],
    roleInCup: "Volunteers.",
    links: [],
  },
  {
    slug: "jeff-chucks",
    name: "Jeff Chucks",
    role: "Entrepreneur",
    area: "Limerick",
    category: "Business & Media",
    hook: "The marketer behind Uptown Events, a Limerick nightlife brand.",
    bio: [
      "Jeff is a talented marketer with a strong business mind. His last venture, Uptown Events, ran nights for Limerick City's party scene.",
    ],
    roleInCup: "Financial support and marketing advice.",
    links: [
      {
        label: "Press",
        url: "https://www.eventbrite.com/e/bad-behavior-3-tickets-1587981378049",
      },
    ],
  },
  {
    slug: "owen-talabi",
    name: "Owen Talabi",
    role: "Videographer & Entrepreneur",
    area: "Limerick",
    category: "Business & Media",
    hook: "Films fashion events, concerts and cultural events in Paris, Rome and London.",
    bio: [
      "Owen is booked internationally, including in Paris, Rome and London, to film fashion events, concerts and cultural events with some of the biggest names in the world.",
      "\"His work is delivered to a standard very few can match.\"",
    ],
    roleInCup: "Producing the media assets for the whole Cup campaign.",
    links: [
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/owen-talabi-a43b70245/",
      },
      {
        label: "Instagram",
        url: "https://www.instagram.com/ot.behindthescreen/",
      },
    ],
  },
];

export interface Article {
  slug: string;
  title: string;
  date: string;
  dateISO: string;
  tag: string;
  standfirst: string;
  readingTime: string;
  pullQuote?: string;
  body: string[];
  talentProfiles?: boolean;
}

export const ARTICLES: Article[] = [];

export const PAST_COVERAGE = [
  {
    outlet: "Irish Independent",
    title:
      "Limerick entrepreneur brings back charity project Swap'N'Serve in exciting collaboration with two local brands",
    url: "https://www.independent.ie/county/limerick/limerick-entrepreneur-brings-back-charity-project-swapnserve-in-exciting-collaboration-with-two-local-brands/a/139147643.html",
  },
  {
    outlet: "Irish Independent",
    title:
      "Focus of Limerick's Swap 'N' Serve clothes event goes far beyond mere fashion",
    url: "https://www.independent.ie/county/limerick/focus-of-limericks-swap-n-serve-clothes-event-goes-far-beyond-mere-fashion/a/145568026.html",
  },
  {
    outlet: "I Love Limerick",
    title: "Swap N Serve community project gives back to those in need",
    url: "https://www.ilovelimerick.ie/swap-n-serve-community-project/",
  },
  {
    outlet: "Limerick Leader",
    title: "Limerick entrepreneur, 20, organises major sustainability event",
    url: "https://www.limerickleader.ie/news/business/limerick-entrepreneur-20-organises-major-sustainability-event-6598019",
  },
  {
    outlet: "Live 95 Limerick Today",
    title: "New sustainable 'Swap N Serve' clothing event comes to Limerick (podcast)",
    url: "https://www.ivoox.com/en/new-sustainable-swap-n-serve-clothing-event-comes-audios-mp3_rf_154840268_1.html",
  },
  {
    outlet: "Limerick Leader",
    title: "Young entrepreneurs are cleaning up Limerick city one road sign at a time",
    url: "https://www.limerickleader.ie/news/young-entrepreneurs-are-cleaning-up-limerick-city-one-road-sign-at-a-time-9047164",
  },
];

export const TIMELINE = [
  { when: "2025", what: "Web Summit Scholar, the first from Limerick and Munster" },
  { when: "August 2025", what: "Founded Swap 'N' Serve and ran its first event" },
  { when: "2026", what: "Second Swap 'N' Serve event, with partners including UL, TUS and Tusla" },
  { when: "5 December 2026", what: "The Swap 'N' Serve Cup at Summerville Rovers F.C." },
];

export const PRESS_ASSETS = [
  { title: "David Hackett, press photo 1" },
  { title: "David Hackett, press photo 2" },
  { title: "Swap 'N' Serve, event photo" },
];

export const ASSET_CREDIT = "Free to use with credit: Swap 'N' Serve";
