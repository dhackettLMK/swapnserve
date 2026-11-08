import cupPeopleImage from "@/assets/limerick-cup-people.jpg.asset.json";
import cupPeoplePreview from "@/assets/limerick-cup-people.webp";
import ncubePhoto from "@/assets/press/mduduzi-valentino-ncube.jpg.asset.json";
import owenTalabiPhoto from "@/assets/press/owen-talabi.jpg.asset.json";
import ryanBeniPhoto from "@/assets/press/ryan-beni.jpg.asset.json";
import jeffChucksPhoto from "@/assets/press/jeff-chucks.jpg.asset.json";
import benOShaughnessyPhoto from "@/assets/press/ben-oshaughnessy.jpg.asset.json";

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
  image?: string;
  imageAlt?: string;
  peopleSections?: { name: string; role: string; area: string; text: string; photo?: string }[];
  closing?: string[];
}

export const ARTICLES: Article[] = [
  {
    slug: "limericks-talent-behind-the-swapnserve-cup",
    title: "Made in Limerick: the people behind the Swap'N'Serve Cup",
    date: "8 November 2026",
    dateISO: "2026-11-08",
    tag: "People & community",
    image: import.meta.env.DEV ? cupPeoplePreview : cupPeopleImage.url,
    imageAlt: "The entertainers, athletes, creatives and community volunteers helping deliver the Swap'N'Serve Cup, pictured and named in the supplied press kit",
    standfirst: "Comedians, footballers, musicians, creatives and community volunteers are coming together to deliver the Swap'N'Serve Cup. For founder David Hackett, the event is a chance to show what Limerick's people can do when their talent is given a stage.",
    readingTime: "5 min read",
    pullQuote: "Every person involved in this event is from Limerick City. You do not have to leave here to find world-class people, you only have to look.",
    body: [
      "Limerick does not need to look elsewhere for talent. It needs to give the people already here the resources, recognition and opportunities to put that talent to work. That is the idea driving David Hackett, the 20-year-old entrepreneur from Raheen behind Swap'N'Serve, and the community event he is bringing to the city this December.",
      "On Saturday 5 December 2026, the Swap'N'Serve Cup will bring football, food, live music and poetry to Summerville Rovers F.C. in Ballinacurra. But behind the tournament is another story: the local people helping to make it happen. Their contribution goes far beyond appearing on a poster. They are shaping the promotion, organising the day, creating its visual identity and sharing their skills with the wider community.",
      "Swap'N'Serve's flagship clothing redistribution events are part of a broader ambition to create positive change in Limerick. The Cup carries that approach into a different setting, bringing people together against hate and discrimination while giving local talent a platform. This is a look at the people helping to deliver it."
],
    peopleSections: [
      {
            "name": "Ben O'Shaughnessy",
            "role": "Entertainer",
            "area": "Rathbane",
            "text": "Ben O'Shaughnessy, an entertainer from Rathbane, brings both a sense of humour and a substantial online audience. The press kit records 20,000 TikTok followers, four million views and 400,000 likes. David describes him as one of the funniest people he has met, with the potential to reach a much wider stage. For the Cup, Ben has been creating promotional videos and connecting the organisation with local restaurants and businesses.",
            "photo": benOShaughnessyPhoto.url
      },
      {
            "name": "Ikeaka Akwajah",
            "role": "Entertainer",
            "area": "Castletroy",
            "text": "Another familiar face online is Castletroy's Ikeaka Akwajah, known on TikTok as Ahukatoofunny. With more than 100 million views, 100,000 followers and 12 million likes reported in the press kit, his reach speaks for itself. His support for Swap'N'Serve is practical too, helping with promotion and marketing so more people hear about the work being done."
      },
      {
            "name": "Darren Nwankwo",
            "role": "Footballer",
            "area": "Raheen",
            "text": "In football, Raheen's Darren Nwankwo plays centre back for Treaty United and has been on trial with Blackburn Rovers in England and Lecce in Italy. David values him not only as a player, but as a kind and generous role model for younger people. Darren has given his time to the Cup's logistics, promotion and marketing."
      },
      {
            "name": "Tamera Keogh",
            "role": "Arts creator",
            "area": "Raheen",
            "text": "The creative work behind an event is often less visible than the finished result. Tamera Keogh, a local arts creator from Raheen, designed and made the Michael Jackson replica glove featured in David's press photographs. Her contribution is a reminder of the craftsmanship and imagination already present in the city."
      },
      {
            "name": "Ryan Beni Dijopang",
            "role": "Model",
            "area": "Ballinacurra Weston",
            "text": "Ballinacurra Weston's Ryan Beni Dijopang brings a different creative perspective: as a model with a strong eye for streetwear, he advises on styling and helps curate the project's visual identity.",
            "photo": ryanBeniPhoto.url
      },
      {
            "name": "Excel Ahmed",
            "role": "Musician & poet",
            "area": "Raheen",
            "text": "Raheen musician and poet Excel Ahmed will perform on the day, alongside helping with logistics and event organisation. His community involvement extends beyond music: he also volunteers as a coach for his younger brother's football team at Regional United. The press kit highlights his recognition through Live 95's New Local Hero wildcard award coverage, but the Cup offers another opportunity for people to experience his work in person."
      },
      {
            "name": "Azeezat Muniru",
            "role": "Architecture student & founder of Aze’s Room",
            "area": "Annacotty",
            "text": "Azeezat Muniru, from Annacotty, studies Architecture at the University of Limerick and runs Aze's Room, an open mic that gives local musicians, poets and other creatives a place to perform. She is bringing that experience to the Cup's poetry workshop and open mic. It is a natural fit for an event built around giving people space to share what they can do."
      },
      {
            "name": "Sean Leddin",
            "role": "Founder of Fíor Jewellery",
            "area": "South Circular Road",
            "text": "Business experience is helping turn the plans into something tangible. Sean Leddin, from the South Circular Road, is the founder of Fíor Jewellery, an Irish-themed jewellery brand stocked across Ireland with a shop in the Crescent Shopping Centre. David credits Sean with financial support and advice on important decisions."
      },
      {
            "name": "Jeff Chucks",
            "role": "Entrepreneur & marketer",
            "area": "Limerick",
            "text": "Entrepreneur and marketer Jeff Chucks, whose work includes Limerick nightlife venture Uptown Events, has also contributed financial support and marketing advice to Swap'N'Serve projects.",
            "photo": jeffChucksPhoto.url
      },
      {
            "name": "Owen Talabi",
            "role": "Videographer & entrepreneur",
            "area": "Limerick",
            "text": "Videographer and entrepreneur Owen Talabi will help produce the media assets for the Cup campaign. His work has taken him to Paris, Rome and London for fashion events, concerts and cultural projects. Bringing that experience into a Limerick community event shows how local connections can put professional creative skills to work close to home.",
            "photo": owenTalabiPhoto.url
      },
      {
            "name": "Oluchi Okoli",
            "role": "Activist & community volunteer",
            "area": "Caherdavin",
            "text": "The organisation also depends on people whose contribution cannot be measured in followers or business milestones. Caherdavin's Oluchi Okoli is a core member of Swap'N'Serve and helped connect the Tusla group with its previous project. Having spoken publicly about reform of the foster care system, she brings advocacy, care and a commitment to making the organisation work well for others."
      },
      {
            "name": "Craig Dawson",
            "role": "Community volunteer",
            "area": "Southill",
            "text": "Southill's Craig Dawson volunteers in his community and hopes to study youth work, with an ambition to help improve life in Southill and across Limerick. He is supporting the Cup's logistics and event management."
      },
      {
            "name": "Chris O'Connor",
            "role": "Runner & community volunteer",
            "area": "Raheen",
            "text": "Chris O'Connor, from Raheen, also gives his free time to the organisation's logistics. His commitment to community volunteering sits alongside personal running achievements, including marathons and a run from Limerick to his father's grave in Cork."
      },
      {
            "name": "Shekinah Makere",
            "role": "Aspiring chef",
            "area": "Raheen",
            "text": "For Shekinah Makere, a young aspiring chef from Raheen, the Cup is an opportunity to take on greater responsibility. She has volunteered with the organisation since Swap'N'Serve 2 and will help cater food at the event, putting her passion for cooking into practice. Her longer-term ambition is to open a restaurant in Limerick."
      },
      {
            "name": "Mduduzi Ncube",
            "role": "Student & volunteer",
            "area": "Castletroy",
            "text": "Mduduzi brings strengths in sport and academics, alongside the time he gives to his church and Swap'N'Serve with his brother Valentino. David describes the brothers' volunteering as fundamental to the organisation's growth.",
            "photo": ncubePhoto.url
      },
      {
            "name": "Valentino Ncube",
            "role": "Student & volunteer",
            "area": "Castletroy",
            "text": "Valentino volunteers with his church and Swap'N'Serve alongside his brother Mduduzi. With strengths in sport and academics, his contribution is rooted in giving his time, showing up and helping others.",
            "photo": ncubePhoto.url
      }
],
    closing: [
      "Together, these people show what David means when he calls Limerick a goldmine of talent. Some already have large audiences or international experience. Others are building their skills through study, volunteering and their first opportunities to take responsibility. The Cup brings those different experiences together, with local people helping to deliver an event for their own city.",
      "The Swap'N'Serve Cup takes place on Saturday 5 December 2026 at 3pm at Summerville Rovers F.C., 124 Ballinacurra Gardens, Ballinacurra (Weston), Limerick, V94 R98D. The football is 5-a-side, with seven members per team and entry at €10 per player. Food, live music, a poetry workshop and an open mic are planned alongside the tournament. Team and individual registration are available at swapnserve.com/cup.",
      "For David, the ambition reaches beyond one afternoon. As he puts it: \"The Cup is only the start. Huge change is coming to this city and young people are going to be the ones leading it, I'm here now.\""
],
  },
];

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
