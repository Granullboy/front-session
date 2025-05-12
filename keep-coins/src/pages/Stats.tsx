import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { getUserStatistics } from '../api/statistics';
import { useAppSelector } from '../hooks/reduxHooks';

const COLORS = ['#36B37E', '#FF6B6B', '#FFA500', '#4A90E2', '#9C27B0', '#8BC34A', '#FF5722'];

export const Stats = () => {
  const token = useAppSelector(state => state.auth.token);
  const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (userId) {
      getUserStatistics(userId).then(setStats);
    }
  }, [userId]);

  if (!stats) {
    return <div className="text-center mt-20 text-gray-500 dark:text-gray-300">Loading statistics...</div>;
  }

  const pieData = stats.category_stats.map((c: any) => ({
    name: c.category_name,
    value: c.total,
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-black dark:text-white">
      <h2 className="text-3xl font-bold text-center mb-8">Statistics</h2>

      {/* Баланс и итоги */}
      <div className="bg-white dark:bg-gray-800 shadow rounded p-6 mb-8">
        <p className="text-lg mb-1">Balance: <span className="font-bold">{stats.balance.toLocaleString()} ₸</span></p>
        <p className="text-green-600">+ Income: {stats.total_income.toLocaleString()} ₸</p>
        <p className="text-red-500">− Expenses: {stats.total_expenses.toLocaleString()} ₸</p>
      </div>

      {/* Диаграмма */}
      <div className="bg-white dark:bg-gray-800 shadow rounded p-6">
        <h3 className="text-xl font-semibold mb-4 text-center">Distribution by Categories</h3>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
