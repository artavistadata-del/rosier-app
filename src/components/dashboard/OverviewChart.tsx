'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Jan', online: 4, store: 2 },
  { name: 'Feb', online: 7, store: 5 },
  { name: 'Mar', online: 5, store: 8 },
  { name: 'Apr', online: 12, store: 6 },
  { name: 'May', online: 8, store: 10 },
  { name: 'Jun', online: 15, store: 12 },
  { name: 'Jul', online: 11, store: 9 },
];

export default function OverviewChart() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Overview</h3>
          <p className="text-sm text-slate-500">Sample Requests Trend</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00AEEF]" />
            <span className="text-xs font-medium text-slate-500">Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#0066B3]" />
            <span className="text-xs font-medium text-slate-500">Pending</span>
          </div>
        </div>
      </div>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorOnline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00AEEF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00AEEF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorStore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0066B3" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0066B3" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748b' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748b' }} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area
              type="monotone"
              dataKey="online"
              stroke="#00AEEF"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorOnline)"
            />
            <Area
              type="monotone"
              dataKey="store"
              stroke="#0066B3"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorStore)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
