export type PepiteTheme = 'prenoms' | 'arbres' | 'accidents';

export type VisualType =
  | 'sparkline-down'
  | 'sparkline-up'
  | 'names-compare'
  | 'timeline'
  | 'trunk'
  | 'species-grid'
  | 'clock'
  | 'bar-compare'
  | 'impact-grid';

export interface SparklineData {
  type: 'sparkline-down' | 'sparkline-up';
  areaPath: string;
  linePath: string;
}

export interface NamesCompareData {
  type: 'names-compare';
  left: { year: string; names: { name: string; highlight?: boolean }[] };
  right: { year: string; names: { name: string; highlight?: boolean }[] };
}

export interface TimelineData {
  type: 'timeline';
  items: { year: string; label: string }[];
}

export interface TrunkData {
  type: 'trunk';
  innerText: string;
  people: number;
}

export interface SpeciesGridData {
  type: 'species-grid';
  chips: { label: string; opacity: number }[];
}

export interface ClockData {
  type: 'clock';
  hourAngle: number; // rotation degrees for the hand final position
  hourAngleFrom: number; // starting rotation
}

export interface BarCompareData {
  type: 'bar-compare';
  bars: { label: string; value: string; width: number; accent: boolean; opacity?: number }[];
}

export interface ImpactGridData {
  type: 'impact-grid';
  cells: { num: string; label: string }[];
}

export type PepiteVisualData =
  | SparklineData
  | NamesCompareData
  | TimelineData
  | TrunkData
  | SpeciesGridData
  | ClockData
  | BarCompareData
  | ImpactGridData;

export interface Pepite {
  id: string;
  theme: PepiteTheme;
  tag: string;
  headline: string;
  bigStat: string;
  statLabel: string;
  body: string;
  sourceUrl: string;
  sourceLabel: string;
  visual: PepiteVisualData;
}

export const THEME_COLORS: Record<PepiteTheme, { accent: string; glow: string }> = {
  prenoms: { accent: '#ff5c5c', glow: '#ff5c5c33' },
  arbres: { accent: '#1fdb6f', glow: '#1fdb6f33' },
  accidents: { accent: '#ffb020', glow: '#ffb02033' },
};

export const pepites: Pepite[] = [
  {
    id: 'marie',
    theme: 'prenoms',
    tag: 'Pr\u00e9noms de Paris',
    headline: 'Marie\ns\u2019efface',
    bigStat: '\u221260%',
    statLabel: 'de naissances \u00ab Marie \u00bb entre 2004 et 2023 \u00e0 Paris',
    body: 'Le pr\u00e9nom le plus iconique de France <strong>dispara\u00eet</strong>. 204 Marie en 2004, ~81 en 2015.',
    sourceUrl: 'https://www.data.gouv.fr/fr/datasets/5c4008ac9ce2e74195bf25b6/',
    sourceLabel: 'data.gouv.fr \u2014 Pr\u00e9noms d\u00e9clar\u00e9s, Ville de Paris',
    visual: {
      type: 'sparkline-down',
      areaPath: 'M0,8 C30,8 50,10 80,14 C110,18 140,22 170,30 C200,38 230,45 260,50 L280,52 L280,60 L0,60 Z',
      linePath: 'M0,8 C30,8 50,10 80,14 C110,18 140,22 170,30 C200,38 230,45 260,50 L280,52',
    },
  },
  {
    id: 'alma',
    theme: 'prenoms',
    tag: 'Pr\u00e9noms de Paris',
    headline: 'Alma sort\nde nulle part',
    bigStat: 'N\u00b01',
    statLabel: 'pr\u00e9nom f\u00e9minin \u00e0 Paris en 2022 \u2014 inexistant avant 2016',
    body: 'En 6 ans, Alma passe de <strong>0 \u00e0 211 naissances</strong>. Une ascension fulgurante, inexpliqu\u00e9e.',
    sourceUrl: 'https://www.data.gouv.fr/fr/datasets/5c4008ac9ce2e74195bf25b6/',
    sourceLabel: 'data.gouv.fr \u2014 Pr\u00e9noms d\u00e9clar\u00e9s, Ville de Paris',
    visual: {
      type: 'sparkline-up',
      areaPath: 'M140,56 C160,54 180,48 200,38 C220,28 240,18 260,10 L280,6 L280,60 L140,60 Z',
      linePath: 'M0,58 L60,58 L100,57 L140,56 C160,54 180,48 200,38 C220,28 240,18 260,10 L280,6',
    },
  },
  {
    id: 'basculement',
    theme: 'prenoms',
    tag: 'Pr\u00e9noms de Paris',
    headline: 'Le grand\nbasculement',
    bigStat: '',
    statLabel: '',
    body: 'En 20 ans, le top parisien a \u00e9t\u00e9 <strong>enti\u00e8rement renouvel\u00e9</strong>. Pas un seul pr\u00e9nom n\u2019a surv\u00e9cu.',
    sourceUrl: 'https://www.data.gouv.fr/fr/datasets/5c4008ac9ce2e74195bf25b6/',
    sourceLabel: 'data.gouv.fr \u2014 Pr\u00e9noms d\u00e9clar\u00e9s, Ville de Paris',
    visual: {
      type: 'names-compare',
      left: {
        year: '2004',
        names: [
          { name: 'Alexandre' },
          { name: 'Thomas' },
          { name: 'In\u00e8s' },
          { name: 'Emma' },
          { name: 'Camille' },
          { name: 'Maxime' },
          { name: 'Hugo' },
          { name: 'Marie', highlight: true },
        ],
      },
      right: {
        year: '2023',
        names: [
          { name: 'Gabriel', highlight: true },
          { name: 'Adam', highlight: true },
          { name: 'Noah' },
          { name: 'Mohamed', highlight: true },
          { name: 'Alma', highlight: true },
          { name: 'Gaspard' },
          { name: 'L\u00e9on' },
          { name: 'Jeanne' },
        ],
      },
    },
  },
  {
    id: 'louis-xiv',
    theme: 'arbres',
    tag: 'Arbres remarquables',
    headline: 'Plant\u00e9 sous\nLouis XIV',
    bigStat: '326 ans',
    statLabel: 'Un ch\u00e2taignier de Meudon, plant\u00e9 en 1700, est toujours vivant',
    body: '',
    sourceUrl: 'https://www.data.gouv.fr/fr/datasets/6482a52736bec857e01c70c7/',
    sourceLabel: 'data.gouv.fr \u2014 Arbres remarquables, CD92',
    visual: {
      type: 'timeline',
      items: [
        { year: '1700', label: 'Plantation du ch\u00e2taignier' },
        { year: '1789', label: 'R\u00e9volution fran\u00e7aise' },
        { year: '1889', label: 'Tour Eiffel construite' },
        { year: '1944', label: 'Lib\u00e9ration de Paris' },
        { year: '2026', label: 'Toujours debout' },
      ],
    },
  },
  {
    id: 'trunk',
    theme: 'arbres',
    tag: 'Arbres remarquables',
    headline: 'Il faut 6 adultes\npour l\u2019enlacer',
    bigStat: '9 m',
    statLabel: 'de circonf\u00e9rence \u2014 Platane d\u2019Orient, Ch\u00e2tenay-Malabry',
    body: '40 m de haut, 35 m d\u2019envergure. <strong>Plant\u00e9 en 1857</strong>, 32 ans avant la Tour Eiffel.',
    sourceUrl: 'https://www.data.gouv.fr/fr/datasets/6482a52736bec857e01c70c7/',
    sourceLabel: 'data.gouv.fr \u2014 Arbres remarquables, CD92',
    visual: {
      type: 'trunk',
      innerText: '\u2205 2,86 m',
      people: 6,
    },
  },
  {
    id: 'species',
    theme: 'arbres',
    tag: 'Arbres remarquables',
    headline: 'Monuments\nvivants',
    bigStat: '1 124',
    statLabel: 'arbres remarquables inventori\u00e9s dans les Hauts-de-Seine',
    body: '<strong>60+ esp\u00e8ces</strong> class\u00e9es selon 6 crit\u00e8res : dimensions, \u00e2ge, raret\u00e9, histoire, pittoresque, paysage.',
    sourceUrl: 'https://www.data.gouv.fr/fr/datasets/6482a52736bec857e01c70c7/',
    sourceLabel: 'data.gouv.fr \u2014 Arbres remarquables, CD92',
    visual: {
      type: 'species-grid',
      chips: [
        { label: 'Ch\u00eane \u00d720', opacity: 1 },
        { label: 'Platane \u00d718', opacity: 0.8 },
        { label: 'C\u00e8dre \u00d715', opacity: 0.6 },
        { label: 'H\u00eatre \u00d712', opacity: 0.5 },
        { label: 'S\u00e9quoia \u00d78', opacity: 0.35 },
        { label: '+ 55 esp\u00e8ces', opacity: 0.25 },
      ],
    },
  },
  {
    id: 'heure-mortelle',
    theme: 'accidents',
    tag: 'Accidents routiers',
    headline: 'L\u2019heure\nla plus mortelle',
    bigStat: '5h',
    statLabel: 'du matin \u2014 3,3\u00d7 plus mortel qu\u2019\u00e0 midi',
    body: '<strong>6,3 % de taux de mortalit\u00e9</strong> \u00e0 5h vs 1,9 % \u00e0 13h. Fatigue, alcool, routes vides.',
    sourceUrl: 'https://www.data.gouv.fr/fr/datasets/53698f4ca3a729239d2036df/',
    sourceLabel: 'data.gouv.fr \u2014 Accidents corporels, Min. Int\u00e9rieur',
    visual: {
      type: 'clock',
      hourAngle: -150,
      hourAngleFrom: -90,
    },
  },
  {
    id: 'campagne-tue',
    theme: 'accidents',
    tag: 'Accidents routiers',
    headline: 'La campagne\ntue',
    bigStat: '\u00d73,2',
    statLabel: 'plus mortel sur route rurale qu\u2019en ville',
    body: 'Moins d\u2019accidents, mais <strong>beaucoup plus mortels</strong>. Vitesse \u00e9lev\u00e9e, secours \u00e9loign\u00e9s.',
    sourceUrl: 'https://www.data.gouv.fr/fr/datasets/53698f4ca3a729239d2036df/',
    sourceLabel: 'data.gouv.fr \u2014 Accidents corporels, Min. Int\u00e9rieur',
    visual: {
      type: 'bar-compare',
      bars: [
        { label: 'Accidents ruraux', value: '37 %', width: 37, accent: true, opacity: 0.5 },
        { label: 'Morts en rural', value: '68 %', width: 68, accent: true },
        { label: 'Accidents urbains', value: '63 %', width: 63, accent: false },
        { label: 'Morts en urbain', value: '32 %', width: 32, accent: false, opacity: 0.6 },
      ],
    },
  },
  {
    id: 'trottinettes',
    theme: 'accidents',
    tag: 'Accidents routiers',
    headline: 'Trottinettes :\nle bilan',
    bigStat: '2 842',
    statLabel: 'accidents impliquant une trottinette \u00e9lectrique en 2024',
    body: 'Un ph\u00e9nom\u00e8ne nouveau, en <strong>explosion</strong>. Quasi-inexistant avant 2019.',
    sourceUrl: 'https://www.data.gouv.fr/fr/datasets/53698f4ca3a729239d2036df/',
    sourceLabel: 'data.gouv.fr \u2014 Accidents corporels, Min. Int\u00e9rieur',
    visual: {
      type: 'impact-grid',
      cells: [
        { num: '52', label: 'tu\u00e9s' },
        { num: '592', label: 'hospitalis\u00e9s' },
        { num: '\u00d74', label: 'en 5 ans' },
        { num: '24 ans', label: '\u00e2ge m\u00e9dian' },
      ],
    },
  },
];
