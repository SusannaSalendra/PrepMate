import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

export const ProgressChart = ({ categoryData = [] }) => {
  if (!categoryData || categoryData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
        <p className="text-sm text-slate-400">No mock interview practice data yet.</p>
        <p className="text-xs text-slate-500 mt-1">Complete your first mock interview session to unlock visual analytics!</p>
      </div>
    );
  }

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl text-xs space-y-1">
          <p className="font-bold text-white">{label}</p>
          <p className="text-indigo-400">
            Questions Attempted: <span className="font-semibold text-white">{payload[0]?.value}</span>
          </p>
          {payload[1] && (
            <p className="text-emerald-400">
              Avg Confidence: <span className="font-semibold text-white">{payload[1]?.value} / 5</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={categoryData}
          margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            tickFormatter={(val) => (val.length > 12 ? `${val.substring(0, 10)}...` : val)}
          />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="attempted" radius={[6, 6, 0, 0]}>
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
