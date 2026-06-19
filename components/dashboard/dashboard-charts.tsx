"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";

import { CardContent, CardDescription, CardHeader, CardTitle, GlassCard } from "@/components/ui/card";

type MonthlyActivityData = {
  month: string;
  total: number;
};

type MembersByUkmData = {
  name: string;
  total: number;
};

type DashboardChartsProps = {
  activitiesByMonth: MonthlyActivityData[];
  membersByUkm: MembersByUkmData[];
};

export function DashboardCharts({ activitiesByMonth, membersByUkm }: DashboardChartsProps) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
      <GlassCard>
        <CardHeader>
          <CardTitle>Grafik Kegiatan per Bulan</CardTitle>
          <CardDescription>Jumlah kegiatan berdasarkan tanggal mulai dalam 12 bulan terakhir.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={activitiesByMonth} margin={{ bottom: 0, left: -16, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="activityTotal" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.38} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#CBD5E1" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={12} stroke="#64748B" tickLine={false} />
                <YAxis allowDecimals={false} fontSize={12} stroke="#64748B" tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255,255,255,0.92)",
                    border: "1px solid rgba(226,232,240,0.9)",
                    borderRadius: 8,
                    boxShadow: "0 12px 32px rgba(15,23,42,0.12)",
                  }}
                />
                <Area
                  activeDot={{ r: 5 }}
                  dataKey="total"
                  fill="url(#activityTotal)"
                  name="Kegiatan"
                  stroke="#2563EB"
                  strokeWidth={2}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </GlassCard>

      <GlassCard>
        <CardHeader>
          <CardTitle>Grafik Anggota per UKM</CardTitle>
          <CardDescription>UKM dengan jumlah anggota aktif terbanyak.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={membersByUkm} layout="vertical" margin={{ bottom: 0, left: 12, right: 12, top: 8 }}>
                <CartesianGrid stroke="#CBD5E1" strokeDasharray="3 3" horizontal={false} />
                <XAxis allowDecimals={false} fontSize={12} stroke="#64748B" tickLine={false} type="number" />
                <YAxis
                  dataKey="name"
                  fontSize={12}
                  interval={0}
                  stroke="#64748B"
                  tickLine={false}
                  type="category"
                  width={96}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255,255,255,0.92)",
                    border: "1px solid rgba(226,232,240,0.9)",
                    borderRadius: 8,
                    boxShadow: "0 12px 32px rgba(15,23,42,0.12)",
                  }}
                />
                <Bar dataKey="total" fill="#10B981" name="Anggota" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </GlassCard>
    </section>
  );
}
