import type { RankingRow } from "@/lib/ranking";

const PODIUM_SIZE = 3;

interface Column {
  label: string;
  value: (row: RankingRow) => string | number;
  /** Estilo de la insignia del encabezado (tarjetas amarilla / roja). */
  badge?: string;
}

const COLUMNS: Column[] = [
  { label: "GF", value: (r) => r.gf },
  { label: "GC", value: (r) => r.gc },
  { label: "DG", value: (r) => (r.dg > 0 ? `+${r.dg}` : r.dg) },
  { label: "A", value: (r) => r.yellow, badge: "bg-card-yellow text-ink" },
  { label: "R", value: (r) => r.red, badge: "bg-accent-coral text-white" },
];

/** El líder va en verde; el resto del podio en azul. */
const podiumColors = (index: number) =>
  index === 0
    ? "text-success-green border-success-green"
    : "text-primary-blue border-primary-blue";

export function RankingTable({ rows }: { rows: RankingRow[] }) {
  return (
    <div className="card overflow-x-auto rounded-2xl">
      <table className="w-full text-sm tabular-nums">
        <thead>
          <tr className="border-b border-border-card bg-black/[0.03] text-left text-xs text-ink/60 uppercase">
            <th className="w-12 px-3 py-2">#</th>
            <th className="px-3 py-2">Equipo</th>
            {COLUMNS.map(({ label, badge }) => (
              <th key={label} className="w-12 px-3 py-2 text-center">
                <span className={`rounded-[3px] px-1.5 py-0.5 ${badge ?? ""}`}>{label}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const podium = index < PODIUM_SIZE;
            return (
              <tr key={row.team.id} className="border-b border-border-card last:border-0">
                <td
                  className={`display px-3 py-2 text-lg ${
                    podium ? podiumColors(index) : "text-ink/50"
                  }`}
                >
                  {index + 1}
                </td>
                <td
                  className={`border-l-4 px-3 py-2 font-semibold ${
                    podium ? podiumColors(index) : "border-transparent"
                  }`}
                >
                  <span className="text-ink">{row.team.name}</span>
                </td>
                {COLUMNS.map(({ label, value }) => (
                  <td key={label} className="px-3 py-2 text-center">
                    {value(row)}
                  </td>
                ))}
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={COLUMNS.length + 2} className="px-3 py-6 text-center text-ink/50">
                Aún no hay equipos inscritos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
