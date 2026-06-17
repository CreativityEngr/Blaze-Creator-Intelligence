import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { useGrowth } from "@/hooks/useCreatorInsights";

export function GrowthPage() {
  const { data } = useGrowth();
  const points = data?.points ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Growth"
        title="Momentum across audience, revenue, and attention"
        description="Follower growth, subscriber growth, and viewer trends stay together without flattening into generic analytics."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Follower growth">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={points}>
              <defs>
                <linearGradient id="followers" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#f5c542" stopOpacity={0.34} />
                  <stop offset="100%" stopColor="#f5c542" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="date" stroke="#9ca3af" tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} width={76} />
              <Tooltip contentStyle={{ background: "#131417", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }} />
              <Area dataKey="followers" stroke="#f5c542" fill="url(#followers)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Subscriber growth">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={points}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="date" stroke="#9ca3af" tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} width={60} />
              <Tooltip contentStyle={{ background: "#131417", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }} />
              <Line dataKey="subscribers" stroke="#8ae6cf" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Viewer trends">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={points}>
              <defs>
                <linearGradient id="viewers" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#7aa7ff" stopOpacity={0.32} />
                  <stop offset="100%" stopColor="#7aa7ff" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="date" stroke="#9ca3af" tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} width={54} />
              <Tooltip contentStyle={{ background: "#131417", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }} />
              <Area dataKey="viewers" stroke="#7aa7ff" fill="url(#viewers)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader>
            <CardTitle>Growth readout</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {[
              ["Follower lift", "+5.96%", "8 day window"],
              ["Subscriber lift", "+7.59%", "High-intent conversion"],
              ["Viewer lift", "+33.04%", "Live trend"]
            ].map(([label, value, detail]) => (
              <div key={label} className="rounded-md border border-line bg-white/[0.035] p-4">
                <p className="text-xs text-muted">{label}</p>
                <p className="mt-2 text-2xl font-semibold">{value}</p>
                <p className="mt-1 text-xs text-muted">{detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
