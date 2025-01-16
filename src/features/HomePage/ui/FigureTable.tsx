import React from "react";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

interface StatisticCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  change: number;
  isPositive: boolean;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  icon,
  title,
  value,
  change,
  isPositive,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
      <div className="bg-green-100 p-4 rounded-full">{icon}</div>
      <div>
        <h4 className="text-xl font-bold">{title}</h4>
        <p className="text-3xl font-extrabold">{value.toLocaleString()}</p>
        <p
          className={`text-sm ${
            isPositive ? "text-green-500" : "text-red-500"
          } flex items-center`}
        >
          {isPositive ? (
            <ArrowUpOutlined className="mr-1" />
          ) : (
            <ArrowDownOutlined className="mr-1" />
          )}
          {Math.abs(change)}% this month
        </p>
      </div>
    </div>
  );
};

export default StatisticCard;
