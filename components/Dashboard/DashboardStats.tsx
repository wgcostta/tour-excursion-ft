import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Stat {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

interface DashboardStatsProps {
  stats: Stat[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      emerald: 'bg-emerald-100 text-emerald-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      red: 'bg-red-100 text-red-600',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getChangeClasses = (changeType?: string) => {
    const changeMap = {
      positive: 'text-green-600',
      negative: 'text-red-600',
      neutral: 'text-gray-600',
    };
    return changeMap[changeType as keyof typeof changeMap] || changeMap.neutral;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="card p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  {stat.change && (
                    <p className={`ml-2 text-sm font-medium ${getChangeClasses(stat.changeType)}`}>
                      {stat.change}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;

