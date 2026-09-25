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
} from 'recharts';

export const ProgressChart = ({ categoryData = [] }) => {
  if (!categoryData || categoryData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-charcoal-850/40 border border-[#20B2AA]/15 text-center">
        <p className="text-xs text-charcoal-400">No mock interview practice data recorded yet.</p>
        <p className="text-[11px] text-charcoal-400 mt-1">Complete your first mock interview session to unlock visual analytics.</p>
      </div>
    );
  }

  // Strictly sea-green family tints
  const SEAGREEN_SHADES = ['#20B2AA', '#3FD1C7', '#17847E', '#0E6E68', '#20B2AA'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-xl bg-charcoal-900 border border-[#20B2AA]/30 shadow-2xl text-xs space-y-1">
          <p className="font-bold text-white font-display">{label}</p>
          <p className="text-[#3FD1C7]">
            Questions Attempted: <span className="font-semibold text-white">{payload[0]?.value}</span>
          </p>
          {payload[1] && (
            <p className="text-[#20B2AA]">
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
          <CartesianGrid strokeDasharray="3 3" stroke="#162B27" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#8EA3A0"
            fontSize={11}
            tickLine={false}
            tickFormatter={(val) => (val.length > 12 ? `${val.substring(0, 10)}...` : val)}
          />
          <YAxis stroke="#8EA3A0" fontSize={11} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="attempted" radius={[6, 6, 0, 0]}>
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={SEAGREEN_SHADES[index % SEAGREEN_SHADES.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
