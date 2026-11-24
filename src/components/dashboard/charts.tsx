import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MONTHLY } from "@/lib/mock-data";
import { rupiah, rupiahShort } from "@/lib/format";

const axis = { fontSize: 11, fill: "var(--muted-foreground)" };

function TipBox({ active, payload, label, money }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string; money?: boolean }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-2 text-muted-foreground">
          <span className="size-2 rounded-full" style={{ background: p.color }} />
          {p.name}: <span className="font-semibold text-foreground num">{money ? rupiah(p.value) : p.value}</span>
        </p>
      ))}
    </div>
  );
}

export function ClosingTrendChart({ stacked = false }: { stacked?: boolean }) {
  return (
    <div className="h-56 w-full lg:h-64">
      <ResponsiveContainer>
        <BarChart data={MONTHLY} barGap={4} margin={{ left: -24, right: 4, top: 8 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={axis} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={axis} />
          <Tooltip cursor={{ fill: "var(--muted)", radius: 8 }} content={<TipBox />} />
          {/* Arrays, not fragments: recharts' react-is cannot detect React 19 fragments */}
          {stacked ? (
            [
              <Bar key="m" dataKey="mandiri" name="Mandiri" stackId="a" fill="var(--brand)" radius={[0, 0, 4, 4]} maxBarSize={28} />,
              <Bar key="k" dataKey="kolaborasi" name="Kolaborasi" stackId="a" fill="var(--cyan)" radius={[6, 6, 0, 0]} maxBarSize={28} />,
            ]
          ) : (
            <Bar dataKey="closing" name="Closing" fill="var(--brand)" radius={[8, 8, 4, 4]} maxBarSize={30} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CommissionChart() {
  return (
    <div className="h-56 w-full lg:h-64">
      <ResponsiveContainer>
        <AreaChart data={MONTHLY} margin={{ left: -6, right: 4, top: 8 }}>
          <defs>
            <linearGradient id="komisiFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--cyan)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--cyan)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={axis} />
          <YAxis tickLine={false} axisLine={false} tick={axis} tickFormatter={(v: number) => rupiahShort(v).replace("Rp", "")} />
          <Tooltip content={<TipBox money />} />
          <Area type="monotone" dataKey="komisi" name="Komisi" stroke="var(--success)" strokeWidth={2.5} fill="url(#komisiFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
