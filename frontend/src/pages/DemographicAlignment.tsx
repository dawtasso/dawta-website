import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ResponsiveBar } from '@nivo/bar';
import { Info } from 'lucide-react';
import {
  fetchDemographicAlignment,
  type DemographicAlignmentResponse,
  type DemographicGroupScore,
  type QuestionAlignmentDetail,
  type DemographicStatistic,
} from '../api/client';
import { PageHeader, LoadingState, ErrorMessage, PageLayout } from '../components';

/* ─── Constants ─── */

const DEMO_FILTERS = [
  { value: '', label: 'Tous' },
  { value: 'gender', label: 'Genre' },
  { value: 'income_difficulty', label: 'Revenu' },
  { value: 'class_belonging', label: 'Classe' },
] as const;

const DEMO_TYPE_LABELS: Record<string, string> = {
  gender: 'Genre',
  income_difficulty: 'Difficulté de revenu',
  class_belonging: 'Classe sociale',
};

const DEMO_VALUE_LABELS: Record<string, string> = {
  male: 'Hommes',
  female: 'Femmes',
  poor: 'Difficultés (revenus)',
  average: 'Moyen (revenus)',
  comfortable: 'À l\'aise (revenus)',
  working_class: 'Classe ouvrière',
  middle_class: 'Classe moyenne',
  upper_class: 'Classe supérieure',
  lower_middle_class: 'Classe moyenne inf.',
  upper_middle_class: 'Classe moyenne sup.',
};

function labelValue(v: string): string {
  return DEMO_VALUE_LABELS[v] || v;
}

/* ─── Chip filter group ─── */

function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
            value === opt.value
              ? 'bg-vermillion text-white shadow-sm'
              : 'bg-theme-secondary text-theme-tertiary hover:bg-ink-50 hover:text-[#F5F0EB]'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Methodology explanation ─── */

function MethodologyBlock() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-8 border border-border rounded-xl bg-surface/50 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-surface transition-colors"
      >
        <Info className="w-4 h-4 text-[#A8A29E] flex-shrink-0" />
        <span className="text-sm font-medium text-[#F5F0EB]">Comprendre les indicateurs</span>
        {open ? (
          <ChevronDown className="w-4 h-4 text-[#78716C] ml-auto" />
        ) : (
          <ChevronRight className="w-4 h-4 text-[#78716C] ml-auto" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-theme-primary space-y-3">
          <div>
            <p className="font-medium text-[#F5F0EB] mb-1">Principe</p>
            <p className="text-theme-tertiary leading-relaxed">
              Pour chaque question de sondage Eurobarometre, nous avons un vote correspondant du Parlement europeen.
              Chaque reponse au sondage a ete manuellement etiquetee comme <strong>alignee</strong> (va dans le sens du vote),
              {' '}<strong>opposee</strong> (va contre le vote), ou <strong>neutre</strong> (pas de lien direct, ex: "ne sait pas").
              En croisant ces etiquettes avec les donnees demographiques du sondage, on mesure si certains groupes sont plus ou moins
              en accord avec les decisions du Parlement.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-surface rounded-lg border border-border">
              <p className="font-medium text-[#F5F0EB] mb-1">Taux d'alignement</p>
              <p className="text-theme-tertiary text-xs leading-relaxed">
                <code className="bg-ink-50 px-1 rounded text-[#F5F0EB]">alignes / (alignes + opposes)</code>
                {' '} — Proportion des repondants (hors neutres) dont la reponse est alignee avec le vote du Parlement.
                Un taux de 50% signifie que le groupe est aussi souvent pour que contre ; au-dessus de 50%, le groupe
                tend a etre en accord avec le Parlement.
              </p>
            </div>
            <div className="p-3 bg-surface rounded-lg border border-border">
              <p className="font-medium text-[#F5F0EB] mb-1">Score net d'alignement</p>
              <p className="text-theme-tertiary text-xs leading-relaxed">
                <code className="bg-ink-50 px-1 rounded text-[#F5F0EB]">(alignes - opposes) / total</code>
                {' '} — Ecart net entre repondants alignes et opposes, rapporte a l'ensemble des repondants
                (neutres inclus). Un score positif signifie que davantage de personnes dans le groupe partagent
                la position du Parlement ; negatif, c'est l'inverse. Ce score penalise les groupes avec
                beaucoup de reponses neutres.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Summary cards ─── */

function SummaryCards({
  data,
  groups,
}: {
  data: DemographicAlignmentResponse;
  groups: DemographicGroupScore[];
}) {
  const totalAligned = groups.reduce((s, g) => s + g.countAligned, 0);
  const totalOpposed = groups.reduce((s, g) => s + g.countOpposed, 0);
  const totalNeutral = groups.reduce((s, g) => s + g.countNeutral, 0);
  const overallRate = totalAligned + totalOpposed > 0
    ? totalAligned / (totalAligned + totalOpposed)
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      <div className="p-4 bg-surface rounded-xl border border-border text-center">
        <div className="text-2xl font-bold text-[#F5F0EB]">{data.summary.totalQuestions}</div>
        <div className="text-xs text-[#A8A29E]/70 mt-1">Questions analysées</div>
      </div>
      <div className="p-4 bg-theme-secondary rounded-xl text-center">
        <div className="text-2xl font-bold text-theme-primary">{data.summary.totalAlignments}</div>
        <div className="text-xs text-theme-tertiary mt-1">Réponses labelisées</div>
      </div>
      <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-center">
        <div className="text-2xl font-bold text-green-600">
          {(overallRate * 100).toFixed(1)}%
        </div>
        <div className="text-xs text-green-600/70 mt-1">Taux d'alignement global</div>
      </div>
      <div className="p-4 bg-theme-secondary rounded-xl text-center">
        <div className="text-2xl font-bold text-theme-primary">
          {(totalAligned + totalOpposed + totalNeutral).toLocaleString()}
        </div>
        <div className="text-xs text-theme-tertiary mt-1">Répondants (pondérés)</div>
      </div>
    </div>
  );
}

/* ─── Alignment rate bar chart (nivo) ─── */

function AlignmentRateChart({ groups }: { groups: DemographicGroupScore[] }) {
  const chartData = groups
    .filter((g) => g.alignmentRate != null)
    .map((g) => ({
      group: labelValue(g.demographicValue),
      'Taux d\'alignement': Math.round((g.alignmentRate ?? 0) * 100),
      demographicType: g.demographicType,
    }))
    .sort((a, b) => b['Taux d\'alignement'] - a['Taux d\'alignement']);

  if (chartData.length === 0) return null;

  const colors: Record<string, string> = {
    gender: '#4E79A7',
    income_difficulty: '#F28E2B',
    class_belonging: '#59A14F',
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-theme-primary mb-1">
        Taux d'alignement par groupe démographique
      </h3>
      <p className="text-xs text-theme-tertiary mb-4">
        Proportion des repondants (hors neutres) dont la reponse correspond au vote du Parlement.
        Au-dessus de 50%, le groupe tend a etre en accord avec les decisions parlementaires.
      </p>
      <div style={{ height: Math.max(300, chartData.length * 45) }}>
        <ResponsiveBar
          data={chartData}
          keys={['Taux d\'alignement']}
          indexBy="group"
          layout="horizontal"
          margin={{ top: 10, right: 60, bottom: 40, left: 160 }}
          padding={0.3}
          valueScale={{ type: 'linear', min: 0, max: 100 }}
          colors={(d) => {
            const item = chartData.find((c) => c.group === d.indexValue);
            return colors[item?.demographicType ?? ''] ?? '#999';
          }}
          borderRadius={4}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            legend: 'Taux d\'alignement (%)',
            legendPosition: 'middle',
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
          }}
          labelSkipWidth={20}
          labelTextColor="#fff"
          valueFormat={(v) => `${v}%`}
          markers={[
            {
              axis: 'x',
              value: 50,
              lineStyle: { stroke: '#888', strokeDasharray: '6 4', strokeWidth: 1 },
              legend: '50%',
              legendPosition: 'top-right',
              textStyle: { fontSize: 11, fill: '#888' },
            },
          ]}
          theme={{
            text: { fontSize: 12 },
            axis: { ticks: { text: { fontSize: 12 } } },
          }}
        />
      </div>
    </div>
  );
}

/* ─── Net alignment diverging chart ─── */

function NetAlignmentChart({ groups }: { groups: DemographicGroupScore[] }) {
  const chartData = groups
    .filter((g) => g.netAlignmentScore != null)
    .map((g) => ({
      group: labelValue(g.demographicValue),
      'Score net': Math.round((g.netAlignmentScore ?? 0) * 100),
    }))
    .sort((a, b) => b['Score net'] - a['Score net']);

  if (chartData.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-theme-primary mb-1">
        Score net d'alignement par groupe
      </h3>
      <p className="text-xs text-theme-tertiary mb-4">
        Difference entre repondants alignes et opposes, rapportee au nombre total de repondants (neutres inclus).
        Un score positif indique un surplus d'alignement avec le Parlement ; negatif, un surplus d'opposition.
      </p>
      <div style={{ height: Math.max(300, chartData.length * 45) }}>
        <ResponsiveBar
          data={chartData}
          keys={['Score net']}
          indexBy="group"
          layout="horizontal"
          margin={{ top: 10, right: 60, bottom: 40, left: 160 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          colors={(d) => {
            const item = chartData.find((c) => c.group === d.indexValue);
            return (item?.['Score net'] ?? 0) >= 0 ? '#2ca02c' : '#d62728';
          }}
          borderRadius={4}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            legend: 'Score net (%)',
            legendPosition: 'middle',
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
          }}
          labelSkipWidth={20}
          labelTextColor="#fff"
          valueFormat={(v) => `${v > 0 ? '+' : ''}${v}%`}
          markers={[
            {
              axis: 'x',
              value: 0,
              lineStyle: { stroke: '#888', strokeWidth: 1 },
            },
          ]}
          theme={{
            text: { fontSize: 12 },
            axis: { ticks: { text: { fontSize: 12 } } },
          }}
        />
      </div>
    </div>
  );
}

/* ─── Statistical significance cards ─── */

function StatisticsCards({ statistics }: { statistics: Record<string, DemographicStatistic> }) {
  const entries = Object.entries(statistics);
  if (entries.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-theme-primary mb-4">
        Significativité statistique
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {entries.map(([type, stat]) => (
          <div
            key={type}
            className={`p-4 rounded-xl border ${
              stat.significant
                ? 'bg-green-50 border-green-200'
                : 'bg-theme-secondary border-theme-light'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-theme-primary">
                {DEMO_TYPE_LABELS[type] || type}
              </span>
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  stat.significant
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {stat.significant ? 'Significatif' : 'Non significatif'}
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-theme-tertiary">Chi-squared</span>
                <span className="font-mono text-theme-primary">{stat.chiSquared.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-theme-tertiary">p-value</span>
                <span className={`font-mono ${stat.pValue < 0.05 ? 'text-green-600 font-medium' : 'text-theme-primary'}`}>
                  {stat.pValue < 0.001 ? '< 0.001' : stat.pValue.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-theme-tertiary">Cramer's V</span>
                <span className="font-mono text-theme-primary">{stat.cramersV.toFixed(4)}</span>
              </div>
            </div>
            {stat.pairwise.length > 0 && (
              <div className="mt-3 pt-3 border-t border-theme-light">
                <div className="text-xs font-medium text-theme-tertiary mb-1.5">
                  Comparaisons par paires
                </div>
                {stat.pairwise.map((p, i) => (
                  <div
                    key={i}
                    className={`text-xs flex justify-between py-0.5 ${
                      p.significant ? 'text-green-700' : 'text-theme-tertiary'
                    }`}
                  >
                    <span>
                      {labelValue(p.group1)} vs {labelValue(p.group2)}
                    </span>
                    <span className="font-mono">
                      z={p.zStat.toFixed(1)}, p={p.pValue < 0.001 ? '<.001' : p.pValue.toFixed(3)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Alignment badge ─── */

const ALIGNMENT_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  aligned: { bg: 'bg-green-100', text: 'text-green-700', label: 'Aligne' },
  opposed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Oppose' },
  neutral: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Neutre' },
  unknown: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Inconnu' },
  unrelated: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Non relie' },
};

function AlignmentBadge({ alignment }: { alignment: string }) {
  const style = ALIGNMENT_STYLES[alignment] || ALIGNMENT_STYLES.unknown;
  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
}

/* ─── Question-level explorer ─── */

function QuestionExplorer({ questions }: { questions: QuestionAlignmentDetail[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (questions.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-theme-primary mb-4">
        Detail par question
      </h3>
      <div className="border border-theme-light rounded-xl overflow-hidden">
        {questions.map((q) => {
          const isExpanded = expandedId === q.questionId;
          return (
            <div key={q.questionId} className="border-b border-theme-light last:border-b-0">
              <button
                onClick={() => setExpandedId(isExpanded ? null : q.questionId)}
                className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-theme-secondary/50 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-theme-tertiary flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-theme-tertiary flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-theme-primary truncate">
                    {q.questionClean || q.questionId}
                  </p>
                  <p className="text-xs text-theme-tertiary truncate mt-0.5">
                    Vote: {q.voteSummaryClean || '—'}
                  </p>
                </div>
                <span className="text-xs font-mono text-theme-tertiary flex-shrink-0">
                  {q.questionId}
                </span>
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4">
                  {/* Answer breakdown: answers × demographic groups */}
                  {q.answers.length > 0 && (() => {
                    // Collect unique demographic groups across all answers
                    const demoGroups: { type: string; value: string }[] = [];
                    const seen = new Set<string>();
                    for (const a of q.answers) {
                      for (const d of a.demographics) {
                        const key = `${d.demographicType}|${d.demographicValue}`;
                        if (!seen.has(key)) {
                          seen.add(key);
                          demoGroups.push({ type: d.demographicType, value: d.demographicValue });
                        }
                      }
                    }

                    return (
                      <div>
                        <div className="text-xs font-semibold text-theme-tertiary uppercase tracking-wide mb-2">
                          Reponses au sondage — votes par groupe demographique
                        </div>
                        <div className="bg-theme-secondary/30 rounded-lg overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-theme-light">
                                <th className="text-left px-3 py-2 text-xs font-medium text-theme-tertiary whitespace-nowrap">
                                  Reponse
                                </th>
                                <th className="text-center px-2 py-2 text-xs font-medium text-theme-tertiary whitespace-nowrap">
                                  Etiquette
                                </th>
                                {demoGroups.map((dg) => (
                                  <th
                                    key={`${dg.type}|${dg.value}`}
                                    className="text-right px-3 py-2 text-xs font-medium text-theme-tertiary whitespace-nowrap"
                                  >
                                    <span className="block text-[10px] text-theme-tertiary/70">
                                      {DEMO_TYPE_LABELS[dg.type] || dg.type}
                                    </span>
                                    {labelValue(dg.value)}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {q.answers.map((a, ai) => {
                                // Build lookup for this answer's demographics
                                const demoLookup = new Map(
                                  a.demographics.map((d) => [`${d.demographicType}|${d.demographicValue}`, d])
                                );
                                return (
                                  <tr
                                    key={ai}
                                    className={`border-b border-theme-light/50 last:border-b-0 ${
                                      a.alignment === 'aligned'
                                        ? 'bg-green-50/40'
                                        : a.alignment === 'opposed'
                                        ? 'bg-red-50/40'
                                        : ''
                                    }`}
                                  >
                                    <td className="px-3 py-2 text-theme-primary max-w-[250px]">
                                      {a.answerLabel}
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                      <AlignmentBadge alignment={a.alignment} />
                                    </td>
                                    {demoGroups.map((dg) => {
                                      const d = demoLookup.get(`${dg.type}|${dg.value}`);
                                      return (
                                        <td
                                          key={`${dg.type}|${dg.value}`}
                                          className="px-3 py-2 text-right font-mono whitespace-nowrap"
                                        >
                                          {d ? (
                                            <>
                                              <span className="text-theme-primary">{d.pct}%</span>
                                              <span className="text-theme-tertiary text-xs ml-1">
                                                ({d.count.toLocaleString()})
                                              </span>
                                            </>
                                          ) : (
                                            <span className="text-theme-tertiary">—</span>
                                          )}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Alignment summary per demographic group */}
                  <div>
                    <div className="text-xs font-semibold text-theme-tertiary uppercase tracking-wide mb-2">
                      Scores d'alignement par groupe
                    </div>
                    <div className="bg-theme-secondary/30 rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-theme-light">
                            <th className="text-left px-3 py-2 text-xs font-medium text-theme-tertiary">
                              Groupe
                            </th>
                            <th className="text-right px-3 py-2 text-xs font-medium text-theme-tertiary">
                              Alignement
                            </th>
                            <th className="text-right px-3 py-2 text-xs font-medium text-theme-tertiary">
                              Score net
                            </th>
                            <th className="text-right px-3 py-2 text-xs font-medium text-theme-tertiary">
                              Alignes
                            </th>
                            <th className="text-right px-3 py-2 text-xs font-medium text-theme-tertiary">
                              Opposes
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {q.demographics.map((d, i) => (
                            <tr key={i} className="border-b border-theme-light/50 last:border-b-0">
                              <td className="px-3 py-2 text-theme-primary">
                                <span className="text-xs text-theme-tertiary mr-1">
                                  {DEMO_TYPE_LABELS[d.demographicType] || d.demographicType}:
                                </span>
                                {labelValue(d.demographicValue)}
                              </td>
                              <td className="px-3 py-2 text-right font-mono">
                                {d.alignmentRate != null
                                  ? `${(d.alignmentRate * 100).toFixed(1)}%`
                                  : '—'}
                              </td>
                              <td
                                className={`px-3 py-2 text-right font-mono ${
                                  (d.netAlignmentScore ?? 0) >= 0
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }`}
                              >
                                {d.netAlignmentScore != null
                                  ? `${d.netAlignmentScore > 0 ? '+' : ''}${(d.netAlignmentScore * 100).toFixed(1)}%`
                                  : '—'}
                              </td>
                              <td className="px-3 py-2 text-right font-mono text-theme-tertiary">
                                {d.countAligned.toLocaleString()}
                              </td>
                              <td className="px-3 py-2 text-right font-mono text-theme-tertiary">
                                {d.countOpposed.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main page ─── */

export default function DemographicAlignment() {
  const [filter, setFilter] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['demographicAlignment', filter],
    queryFn: () => fetchDemographicAlignment(filter || undefined),
  });

  const filteredGroups = useMemo(() => {
    if (!data) return [];
    return data.byDemographic;
  }, [data]);

  return (
    <PageLayout maxWidth="6xl">
      <PageHeader
        title="Alignement démographique"
        subtitle="Quels groupes démographiques sont les plus ou moins alignés avec les votes du Parlement européen ?"
      />

      {/* Filter chips */}
      <div className="mb-6">
        <ChipGroup options={DEMO_FILTERS} value={filter} onChange={setFilter} />
      </div>

      {isLoading && <LoadingState message="Calcul de l'alignement démographique..." />}

      {error && (
        <ErrorMessage
          title="Erreur de chargement"
          message={(error as Error).message}
          hint="Vérifiez que le backend est lancé : make run-backend"
        />
      )}

      <MethodologyBlock />

      {data && (
        <>
          <SummaryCards data={data} groups={filteredGroups} />
          <AlignmentRateChart groups={filteredGroups} />
          <NetAlignmentChart groups={filteredGroups} />
          <StatisticsCards statistics={data.statistics} />
          <QuestionExplorer questions={data.byQuestion} />
        </>
      )}
    </PageLayout>
  );
}
