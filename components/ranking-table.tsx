import type { RankingRow } from "@/lib/ranking";

const PODIUM_SIZE = 3;

interface Column {
  label: string;
  value: (row: RankingRow) => string | number;
  className?: string;
}

const COLUMNS: Column[] = [
  { label: "GF", value: (r) => r.gf },
  { label: "GC", value: (r) => r.gc },
  { label: "DG", value: (r) => (r.dg > 0 ? `+${r.dg}` : r.dg) },
  { label: "A", value: (r) => r.yellow, className: "text-card-yellow" },
  { label: "R", value: (r) => r.red, className: "text-card-red" },
];

export function RankingTable({ rows }: { rows: RankingRow[] }) {
  return (
    <div className="glass overflow-x-auto rounded-2xl">
      <table className="w-full text-sm tabular-nums">
        <thead>
          <tr className="border-b border-border-glass text-left text-xs text-white/50 uppercase">
            <th className="w-12 px-3 py-2">#</th>
            <th className="px-3 py-2">Equipo</th>
            {COLUMNS.map(({ label, className }) => (
              <th key={label} className={`w-12 px-3 py-2 text-center ${className ?? ""}`}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const podium = index < PODIUM_SIZE;
            return (
              <tr key={row.team.id} className="border-b border-border-glass/50 last:border-0">
                <td
                  className={`display px-3 py-2 text-lg ${podium ? "text-primary-neon" : "text-white/60"}`}
                >
                  {index + 1}
                </td>
                <td
                  className={`px-3 py-2 font-semibold ${
                    podium ? "border-l-2 border-primary-neon" : "border-l-2 border-transparent"
                  }`}
                >
                  {row.team.name}
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
              <td colSpan={COLUMNS.length + 2} className="px-3 py-6 text-center text-white/50">
                Aún no hay equipos inscritos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
