'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Approved', value: 45 },
  { name: 'Pending', value: 25 },
  { name: 'Completed', value: 30 },
];

const COLORS = ['#00AEEF', '#8DC63F', '#0066B3'];

export default function AnalyticsChart() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">Analytics</h3>
        <button className="text-slate-400 hover:text-slate-600">...</button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
                cornerRadius={10}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-3xl font-extrabold text-slate-800">80%</p>
          <p className="text-xs font-medium text-slate-500">Processed</p>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-6 mt-4">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-md" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }} 
            />
            <span className="text-sm font-medium text-slate-600">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
