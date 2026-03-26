import { useState } from 'react';
import { PageLayout, PageHeader } from '../components';

type Nationalite = 'israelien' | 'francais';
type FilterMode = 'tous' | 'israelien' | 'francais';

interface Personne {
  nom: string;
  fonction: string;
  nationalite: Nationalite;
  faits: string;
  sources: string[];
}

interface Article {
  id: number;
  titre: string;
  resume: string;
  peines: string;
  texteCle: string;
  contexteOnu: string;
  personnes: Personne[];
}

const ARTICLES: Article[] = [
  {
    id: 1,
    titre: 'Présentation d\'actes de terrorisme comme une légitime résistance',
    resume:
      'Élargit l\'apologie du terrorisme à « directement ou indirectement ». Pénalise la présentation d\'actes terroristes comme « légitime résistance ». Pénalise la minoration ou banalisation d\'actes terroristes.',
    peines: '5 ans / 75 000 € (apologie) — 1 an / 45 000 € (minoration)',
    texteCle:
      '« Est puni des mêmes peines le fait de tenir publiquement des propos présentant des actes de terrorisme comme une légitime résistance. »\n\n« Le fait [...] de minorer, relativiser ou banaliser publiquement [des actes de terrorisme] est puni d\'un an d\'emprisonnement et de 45 000 euros d\'amende. »',
    contexteOnu:
      'La résolution 2334 (2016) du Conseil de sécurité déclare illégale la colonisation israélienne. La CIJ a qualifié l\'occupation de contraire au droit international (avis consultatif de juillet 2024). La résolution ES-10/21 (2023) de l\'Assemblée générale a appelé à un cessez-le-feu humanitaire immédiat à Gaza.',
    personnes: [
      {
        nom: 'Bezalel Smotrich',
        fonction: 'Ministre des Finances d\'Israël',
        nationalite: 'israelien',
        faits:
          'En mars 2023, lors d\'un discours à Paris devant une carte incluant la Jordanie dans « Israël », a déclaré que « le peuple palestinien n\'existe pas » et a qualifié le village palestinien de Huwara de devant être « effacé ». En novembre 2023, a déclaré que les violences des colons contre les Palestiniens étaient de la « légitime défense ». La qualification de violences documentées par l\'ONU comme « légitime défense » constitue une banalisation de ces actes.',
        sources: [
        ],
      },
      {
        nom: 'Itamar Ben Gvir',
        fonction: 'Ministre de la Sécurité nationale d\'Israël',
        nationalite: 'israelien',
        faits:
          'A distribué des armes aux colons et légitimé les attaques contre des villages palestiniens. En parlant de Yitzhak Rabin, il dit « Nous avons eu sa voiture, et nous l’aurons lui aussi »; Rabin sera assassiné quelques semaines plus tard par un militant d\'extrême droite. Il déclare admirer Ygal Amir, l\'assassin du Premier ministre Yitzhak Rabin, arrêté et condamné par la justice.',
        sources: [
          "https://www.middleeasteye.net/fr/opinionfr/israel-palestine-armer-milices-juives-terrorisme-colons-ben-gvir",
"https://fr.wikipedia.org/wiki/Itamar_Ben-Gvir#:~:text=%C2%AB%C2%A0Nous%20avons%20eu%20sa%20voiture%2C%20et%20nous%20l%E2%80%99aurons%20lui%20aussi%C2%A0%C2%BB%5B2%5D%2C%20lance%2Dt%2Dil%C2%A0%3B%20Yitzhak%20Rabin%20sera%20assassin%C3%A9%20quelques%20semaines%20plus%20tard%20par%20un%20militant%20d%27extr%C3%AAme%20droite%5B12%5D.%20Il%20d%C3%A9clare%20admirer%20Ygal%20Amir%2C%20l%27assassin%20du%20Premier%20ministre%20Yitzhak%20Rabin%2C%20arr%C3%AAt%C3%A9%20et%20condamn%C3%A9%20par%20la%20justice%5B7",

        ],
      },
      {
        nom: 'Yoav Gallant',
        fonction: 'Ancien ministre de la Défense d\'Israël',
        nationalite: 'israelien',
        faits:
          'Le 9 octobre 2023, a déclaré : « Nous combattons des animaux humains et nous agissons en conséquence ». Cette déshumanisation de l\'ensemble de la population de Gaza constitue une banalisation et minoration des conséquences des opérations militaires sur les civils. L\'ONU a qualifié ces propos de déshumanisants et potentiellement constitutifs d\'incitation au génocide.',
        sources: [
          "https://www.assemblee-nationale.fr/dyn/opendata/PNREANR5L16B2123.html#:~:text=En%20t%C3%A9moignent%20certaines%20d%C3%A9clarations%20de%20responsables%20isra%C3%A9liens%2C%20tels%20que%20Yoav%C2%A0Gallant%2C%20ministre%20de%20la%20d%C3%A9fense%2C%20qui%2C%20alors%20qu%E2%80%99il%20%C2%AB%C2%A0%7Bordonnait%7D%20le%20si%C3%A8ge%20total%20de%20Gaza%C2%A0%C2%BB%20le%209%C2%A0octobre%2C%20d%C3%A9clarait%20%C2%AB%C2%A0nous%20combattons%20des%20animaux%20humains%2C%20nous%20agissons%20en%20cons%C3%A9quence%C2%A0%C2%BB."
        ],
      },
      {
        nom: 'Benjamin Netanyahu',
        fonction: 'Premier ministre d\'Israël',
        nationalite: 'israelien',
        faits:
          'A présenté à l\'ONU en septembre 2023 une carte du « Nouveau Moyen-Orient » effaçant la Palestine. «C’est une guerre de civilisation!» pour le premier ministre israélien, «il n’existe pas d’État palestinien» et Israël gardera le contrôle de la sécurité «du Jourdain à la mer».',
        sources: [
          "https://www.middleeasteye.net/fr/actu-et-enquetes/israel-arabie-saoudite-netanyahou-carte-efface-palestine-normalisation-onu",
          "https://www.tdg.ch/netanyahou-cest-une-guerre-de-civilisation-884680238768"

        ],
      },
      {
        nom: 'Meyer Habib',
        fonction: 'Ancien député français (2013-2024)',
        nationalite: 'francais',
        faits:
          'A qualifié à de nombreuses reprises les opérations militaires israéliennes à Gaza de « légitime défense d\'Israël », y compris lors de bombardements ayant causé des victimes civiles massives documentées par l\'ONU. A systématiquement relativisé et minoré le nombre de victimes civiles palestiniennes.',
        sources: [
        ],
      },
    ],
  },
  {
    id: 2,
    titre: 'Provocation à la destruction ou négation d\'un État',
    resume:
      'Crée un nouveau délit de provocation directe ou indirecte à la destruction ou négation d\'un État, ou apologie publique de sa destruction/négation.',
    peines: '5 ans d\'emprisonnement et 75 000 € d\'amende',
    texteCle:
      '« Le fait de provoquer directement ou indirectement à la destruction ou à la négation d\'un État, ou de faire publiquement l\'apologie de sa destruction ou de sa négation, est puni de cinq ans d\'emprisonnement et de 75 000 euros d\'amende. »',
    contexteOnu:
      'La résolution 181 (1947) de l\'Assemblée générale de l\'ONU prévoit la création de deux États. La résolution 67/19 (2012) reconnaît la Palestine comme État observateur non membre. La résolution 2334 (2016) réaffirme l\'illégalité des colonies et la solution à deux États. 149 pays sur 193 reconnaissent l\'État de Palestine (mars 2026).',
    personnes: [
      {
        nom: 'Benjamin Netanyahu',
        fonction: 'Premier ministre d\'Israël',
        nationalite: 'israelien',
        faits:
          'En janvier 2024, a déclaré : « Je ne ferai pas de compromis sur le contrôle sécuritaire israélien total sur l\'ensemble du territoire à l\'ouest du Jourdain — et cela est contradictoire avec un État palestinien ». En septembre 2023, a présenté à l\'ONU une carte où la Palestine n\'existe pas. Rejette publiquement la création d\'un État palestinien, reconnu par 149 pays.',
        sources: [
        ],
      },
      {
        nom: 'Bezalel Smotrich',
        fonction: 'Ministre des Finances d\'Israël',
        nationalite: 'israelien',
        faits:
          'A déclaré en mars 2023 à Paris : « Il n\'y a pas de peuple palestinien ». A publié un plan appelant à l\'annexion de toute la Cisjordanie et au refus de tout État palestinien. Nie l\'existence même du peuple auquel la résolution 181 accorde un État.',
        sources: [
        ],
      },
      {
        nom: 'Itamar Ben Gvir',
        fonction: 'Ministre de la Sécurité nationale d\'Israël',
        nationalite: 'israelien',
        faits:
          'Milite ouvertement pour l\'annexion totale de la Cisjordanie et contre tout État palestinien. A déclaré : « Mon droit sur [la Cisjordanie] est supérieur à celui des Arabes ». Prône la « réémigration volontaire » des Palestiniens.',
        sources: [
        ],
      },
      {
        nom: 'Naftali Bennett',
        fonction: 'Ancien Premier ministre d\'Israël (2021-2022)',
        nationalite: 'israelien',
        faits:
          'A déclaré : « Je ferai tout ce qui est en mon pouvoir pour empêcher un État palestinien ». A proposé l\'annexion de la zone C (60% de la Cisjordanie). Ces déclarations constituent une provocation directe à la négation de l\'État de Palestine reconnu par l\'ONU.',
        sources: [
        ],
      },
      {
        nom: 'Avigdor Lieberman',
        fonction: 'Ancien ministre des Affaires étrangères d\'Israël',
        nationalite: 'israelien',
        faits:
          'A proposé publiquement des plans de « transfert de population » visant à nier les droits nationaux palestiniens. A qualifié les citoyens arabes d\'Israël de « cinquième colonne ».',
        sources: [
        ],
      },
      {
        nom: 'Éric Zemmour',
        fonction: 'Ancien candidat à la présidentielle française',
        nationalite: 'francais',
        faits:
          'A déclaré en octobre 2023 sur CNews : « Il n\'y a pas de peuple palestinien, il n\'y a pas d\'État palestinien ». Cette négation publique d\'un État reconnu par 149 pays et l\'Assemblée générale de l\'ONU tombe directement sous le coup de l\'article 2.',
        sources: [
        ],
      },
      {
        nom: 'Sylvain Maillard',
        fonction: 'Député, cosignataire de la proposition de loi',
        nationalite: 'francais',
        faits:
          'Cosignataire de la proposition de loi, a conditionné la reconnaissance de l\'État palestinien à des prérequis non prévus par les résolutions de l\'ONU, ce qui revient à nier de facto le droit à l\'autodétermination reconnu par l\'Assemblée générale.',
        sources: [
        ],
      },
    ],
  },
  {
    id: 3,
    titre: 'Élargissement de la constitution de partie civile',
    resume:
      'Élargit les conditions de recevabilité des associations antiracistes pour se constituer partie civile.',
    peines: 'N/A (article procédural)',
    texteCle:
      'Modifie les articles 2-1 et 2-9 du Code de procédure pénale pour permettre aux associations de se constituer partie civile pour toutes les infractions commises avec la circonstance aggravante de racisme (art. 132-76 CP) et pour le nouveau délit de l\'article 437-1.',
    contexteOnu:
      "Le Comité pour l\'élimination de la discrimination raciale (CERD) de l\'ONU a documenté des discriminations systématiques contre les Palestiniens. Amnesty International, Human Rights Watch et le rapporteur spécial de l\'ONU ont qualifié la situation d\'apartheid (2022). \n - https://www.ohchr.org/fr/press-releases/2022/03/special-rapporteur-situation-human-rights-occupied-palestinian-territories",
    personnes: [
      {
        nom: 'Analyse structurelle',
        fonction: 'Application asymétrique de la loi',
        nationalite: 'israelien',
        faits:
          'Cet article procédural élargit les droits d\'action des associations antiracistes. Appliqué symétriquement, il permettrait aux associations de défense des droits des Palestiniens de se constituer partie civile contre des propos racistes anti-arabes ou anti-palestiniens — propos documentés par le CERD de l\'ONU. En pratique, la loi Payan vise à faciliter les poursuites dans un seul sens.',
        sources: [
        ],
      },
      {
        nom: 'Asymétrie institutionnelle',
        fonction: 'Associations bénéficiaires vs. exclues',
        nationalite: 'francais',
        faits:
          'L\'article 3 facilite l\'action en justice d\'associations comme le CRIF ou la LICRA. Appliqué symétriquement, il devrait aussi permettre à des associations comme l\'AFPS (Association France Palestine Solidarité) de se constituer partie civile contre des propos racistes anti-arabes tenus publiquement en France.',
        sources: [
        ],
      },
    ],
  },
  {
    id: 4,
    titre: 'Extension du délit de contestation des crimes contre l\humanité',
    resume:
      'Étend la contestation de tous les crimes contre l\'humanité. Le texte initial, l’article 24 bis de la loi du 29 juillet 1881, a pour but d’interdire et de réprimer toute diffusion de la contestation des crimes contre l’humanité tels qu’ils ont été définis par l’accord de Londres du 8 août 1945. - L\'alinea complet avant amendement: https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000043982451',
    peines: '1 an d\'emprisonnement et 45 000 € d\'amende',
    texteCle:
      '« La contestation [...] peut consister en une négation, minoration, relativisation ou banalisation outrancière. Elle est punissable même si elle est présentée sous forme déguisée, dubitative, par voie d\'insinuation ou de comparaison, d\'analogie ou de rapprochement. »',
    contexteOnu:
      'La CIJ a reconnu en janvier 2024 la plausibilité d\'un génocide à Gaza (ordonnance Afrique du Sud c. Israël). Le rapporteur spécial Francesca Albanese a qualifié les actes à Gaza d\'« actes de génocide » (mars 2024). La CPI a émis des mandats d\'arrêt contre Netanyahu et Gallant en novembre 2024.',
    personnes: [
      {
        nom: 'Benjamin Netanyahu',
        fonction: 'Premier ministre d\'Israël',
        nationalite: 'israelien',
        faits:
          'A qualifié les accusations de génocide portées devant la CIJ de « scandaleuses ». A systématiquement utilisé la mémoire de la Shoah pour justifier les opérations militaires à Gaza, comparant le Hamas aux nazis. Cette instrumentalisation de la Shoah à des fins politiques constitue, selon plusieurs historiens, une banalisation par comparaison abusive.',
        sources: [
        ],
      },
      {
        nom: 'Yoav Gallant',
        fonction: 'Ancien ministre de la Défense d\'Israël',
        nationalite: 'israelien',
        faits:
          'En qualifiant les Palestiniens d\'« animaux humains », a utilisé un langage déshumanisant rappelant la terminologie nazie, ce qui constitue une banalisation de la Shoah par comparaison inversée. Visé par un mandat d\'arrêt de la CPI pour crimes de guerre et crimes contre l\'humanité.',
        sources: [
        ],
      },
      {
        nom: 'Éric Zemmour',
        fonction: 'Ancien candidat à la présidentielle française',
        nationalite: 'francais',
        faits:
          'En octobre 2019, a déclaré que le régime de Vichy avait « protégé les Juifs français » en livrant les Juifs étrangers, contestant la responsabilité de l\'État français dans la Shoah. Condamné pour contestation de crime contre l\'humanité.',
        sources: [
          "https://www.lemonde.fr/societe/article/2025/04/02/eric-zemmour-condamne-a-10-000-euros-d-amende-apres-avoir-declare-que-philippe-petain-avait-sauve-les-juifs-francais_6589971_3224.html",
        ],
      },
    ],
  },
];

const FILTER_LABELS: Record<FilterMode, string> = {
  tous: 'Tous',
  israelien: 'Israéliens',
  francais: 'Français',
};

function SourceLink({ url }: { url: string }) {
  const domain = new URL(url).hostname.replace('www.', '');
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-bordeaux-600 hover:text-bordeaux-800 underline text-sm break-all"
    >
      {domain}
    </a>
  );
}

function VoteButtons({ articleId, personneIndex }: { articleId: number; personneIndex: number }) {
  const storageKey = `tier-payan-vote-${articleId}-${personneIndex}`;
  const countKey = `tier-payan-counts-${articleId}-${personneIndex}`;

  const [userVote, setUserVote] = useState<'up' | 'down' | null>(() => {
    try { return localStorage.getItem(storageKey) as 'up' | 'down' | null; } catch { return null; }
  });
  const [counts, setCounts] = useState<{ up: number; down: number }>(() => {
    try {
      const stored = localStorage.getItem(countKey);
      return stored ? JSON.parse(stored) : { up: 0, down: 0 };
    } catch { return { up: 0, down: 0 }; }
  });

  const vote = (direction: 'up' | 'down') => {
    let newCounts = { ...counts };
    let newVote: 'up' | 'down' | null = direction;

    if (userVote === direction) {
      // Undo vote
      newCounts[direction]--;
      newVote = null;
    } else {
      if (userVote) newCounts[userVote]--;
      newCounts[direction]++;
    }

    setCounts(newCounts);
    setUserVote(newVote);
    try {
      if (newVote) localStorage.setItem(storageKey, newVote);
      else localStorage.removeItem(storageKey);
      localStorage.setItem(countKey, JSON.stringify(newCounts));
    } catch { /* ignore */ }
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => vote('up')}
        className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs transition-colors ${
          userVote === 'up'
            ? 'bg-green-100 text-green-700 font-medium'
            : 'text-dawta-400 hover:text-green-600 hover:bg-green-50'
        }`}
        title="Fait vérifié / correct"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
        {counts.up > 0 && <span>{counts.up}</span>}
      </button>
      <button
        onClick={() => vote('down')}
        className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs transition-colors ${
          userVote === 'down'
            ? 'bg-red-100 text-red-700 font-medium'
            : 'text-dawta-400 hover:text-red-600 hover:bg-red-50'
        }`}
        title="Fait incorrect / source douteuse"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {counts.down > 0 && <span>{counts.down}</span>}
      </button>
    </div>
  );
}

function PersonneCard({ personne, articleId, personneIndex }: { personne: Personne; articleId: number; personneIndex: number }) {
  const flagEmoji = personne.nationalite === 'israelien' ? '\u{1F1EE}\u{1F1F1}' : '\u{1F1EB}\u{1F1F7}';
  return (
    <div className="border border-theme-light rounded-lg p-4 bg-theme-secondary">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <span className="font-medium text-theme-primary">{personne.nom}</span>
          <span className="ml-2 text-sm text-theme-secondary">{flagEmoji}</span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-dawta-100 text-dawta-700 whitespace-nowrap">
          {personne.fonction}
        </span>
      </div>
      <p className="text-sm text-theme-secondary leading-relaxed mb-3">
        {personne.faits}
      </p>
      <div className="flex items-center justify-between">
        {personne.sources.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {personne.sources.map((src, i) => (
              <SourceLink key={i} url={src} />
            ))}
          </div>
        )}
        <VoteButtons articleId={articleId} personneIndex={personneIndex} />
      </div>
    </div>
  );
}

function ArticleAccordion({
  article,
  filter,
}: {
  article: Article;
  filter: FilterMode;
}) {
  const [open, setOpen] = useState(false);

  const filtered =
    filter === 'tous'
      ? article.personnes
      : article.personnes.filter((p) => p.nationalite === filter);

  const countIsraelien = article.personnes.filter(
    (p) => p.nationalite === 'israelien'
  ).length;
  const countFrancais = article.personnes.filter(
    (p) => p.nationalite === 'francais'
  ).length;

  return (
    <div className="border border-theme rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-6 py-4 flex items-center justify-between bg-theme-primary hover:bg-theme-secondary transition-colors"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-lg font-medium text-theme-primary">
              Article {article.id}
            </span>
            <span className="text-theme-secondary">—</span>
            <span className="text-theme-secondary">{article.titre}</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs px-2 py-0.5 rounded-full bg-bordeaux-100 text-bordeaux-700 font-medium">
              {article.peines}
            </span>
            <span className="text-xs text-dawta-400">
              {countIsraelien} israélien{countIsraelien > 1 ? 's' : ''} · {countFrancais} français
            </span>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-dawta-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-6 py-5 space-y-6 bg-theme-primary">
          {/* Texte de loi */}
          <div>
            <h4 className="text-sm font-medium text-dawta-500 uppercase tracking-wide mb-2">
              Texte de loi
            </h4>
            <blockquote className="border-l-4 border-bordeaux-300 pl-4 text-sm text-theme-secondary italic leading-relaxed whitespace-pre-line">
              {article.texteCle}
            </blockquote>
          </div>

          {/* Résumé */}
          <div>
            <h4 className="text-sm font-medium text-dawta-500 uppercase tracking-wide mb-2">
              Résumé
            </h4>
            <p className="text-sm text-theme-secondary leading-relaxed">
              {article.resume}
            </p>
          </div>

          {/* Contexte ONU */}
          <div>
            <h4 className="text-sm font-medium text-dawta-500 uppercase tracking-wide mb-2">
              Contexte ONU
            </h4>
            <p className="text-sm text-theme-secondary leading-relaxed">
              {article.contexteOnu}
            </p>
          </div>

          {/* Personnes */}
          <div>
            <h4 className="text-sm font-medium text-dawta-500 uppercase tracking-wide mb-3">
              Personnes potentiellement condamnables
              {filter !== 'tous' && (
                <span className="ml-2 text-dawta-400 normal-case">
                  (filtre : {FILTER_LABELS[filter]})
                </span>
              )}
            </h4>
            {filtered.length === 0 ? (
              <p className="text-sm text-dawta-400 italic">
                Aucune personne dans cette catégorie pour cet article.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
                {filtered.map((p, i) => (
                  <PersonneCard key={i} personne={p} articleId={article.id} personneIndex={article.personnes.indexOf(p)} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TierPayan() {
  const [filter, setFilter] = useState<FilterMode>('tous');

  const totalPersonnes = ARTICLES.reduce(
    (acc, a) => acc + a.personnes.length,
    0
  );
  const totalIsraelien = ARTICLES.reduce(
    (acc, a) =>
      acc + a.personnes.filter((p) => p.nationalite === 'israelien').length,
    0
  );
  const totalFrancais = ARTICLES.reduce(
    (acc, a) =>
      acc + a.personnes.filter((p) => p.nationalite === 'francais').length,
    0
  );

  return (
    <PageLayout maxWidth="6xl">
      <PageHeader
        title="Proposition de loi Payan"
        subtitle="Application hypothétique au cas Israël-Palestine"
      />

      {/* Introduction */}
      <div className="mb-8 space-y-4">
        <p className="text-theme-secondary leading-relaxed">
          Cette analyse applique hypothétiquement les dispositions pénales de la{' '}
          <a
            href="https://www.assemblee-nationale.fr/dyn/17/textes/l17b0575_proposition-loi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-bordeaux-600 hover:text-bordeaux-800 underline"
          >
            proposition de loi n°575
          </a>{' '}
          (dite « Payan », déposée le 19 novembre 2024 par Caroline Yadan) au conflit
          israélo-palestinien. Pour chaque article, nous identifions des déclarations
          publiques documentées qui, si cette loi était appliquée de manière symétrique,
          pourraient tomber sous le coup de ses dispositions.
        </p>
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Note sur la fiabilité :</strong> Les faits ci-dessous ont été initialement
            générés par un LLM (Claude) puis partiellement vérifiés manuellement. Les sources
            sont indicatives et peuvent contenir des erreurs ou des liens obsolètes. Utilisez les
            boutons +/- pour signaler les faits que vous jugez corrects ou incorrects.
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-6 text-sm text-dawta-500">
          <span>{ARTICLES.length} articles analysés</span>
          <span>{totalPersonnes} personnes identifiées</span>
          <span>{totalIsraelien} israéliens</span>
          <span>{totalFrancais} français</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-dawta-100 rounded-lg w-fit">
        {(Object.keys(FILTER_LABELS) as FilterMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setFilter(mode)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === mode
                ? 'bg-bordeaux-600 text-white shadow-sm'
                : 'text-dawta-600 hover:text-dawta-800 hover:bg-dawta-50'
            }`}
          >
            {FILTER_LABELS[mode]}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div className="space-y-4">
        {ARTICLES.map((article) => (
          <ArticleAccordion
            key={article.id}
            article={article}
            filter={filter}
          />
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-12 p-6 border border-dawta-200 rounded-xl bg-dawta-50">
        <h3 className="text-sm font-medium text-dawta-600 uppercase tracking-wide mb-2">
          Disclaimer méthodologique
        </h3>
        <p className="text-sm text-dawta-500 leading-relaxed mb-3">
          Cette analyse est un exercice intellectuel d'application symétrique d'un texte
          de loi. Elle ne constitue ni un avis juridique, ni une accusation. L'objectif est de
          démontrer que les dispositions de la proposition de loi Payan, si elles étaient
          appliquées de manière non discriminatoire, concerneraient également des
          responsables israéliens et des personnalités politiques françaises soutenant la
          politique du gouvernement israélien.
        </p>
        <p className="text-sm text-amber-700 leading-relaxed">
          <strong>Avertissement :</strong> Les faits cités ont été initialement générés par un
          LLM (Claude) et n'ont été que partiellement vérifiés par un humain. Les sources
          peuvent contenir des erreurs, des approximations ou des liens cassés. Cette page
          est un travail en cours — les votes des utilisateurs (+/-) aident à identifier les
          informations à corriger.
        </p>
      </div>
    </PageLayout>
  );
}
