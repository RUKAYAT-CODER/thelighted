"use client";

import React, { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Define the incoming data structure
export interface ContactSubmissionData {
  date: string;
  count: number;
}

interface ContactTrendsProps {
  data: ContactSubmissionData[];
}

const ContactTrends: React.FC<ContactTrendsProps> = ({ data }) => {
  // Transform the data: format dates and map 'count' to 'contacts'
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map((item) => ({
      date: format(parseISO(item.date), "MMM dd"),
      contacts: item.count,
    }));
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">
          Contact Submissions Trend
        </h3>
        <p className="text-sm text-gray-500">
          Daily overview of incoming contact requests
        </p>
      </div>

      <div className="h-72 w-full">
        {chartData.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-lg bg-gray-50/50">
            <p className="text-gray-500 font-medium text-sm">
              No contact data available
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              {/* Define the subtle gray gradient fill */}
              <defs>
                <linearGradient id="colorContacts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#111827" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#111827" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                dy={10}
              />
              
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                allowDecimals={false}
              />
              
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  fontSize: "14px",
                  color: "#111827"
                }}
                itemStyle={{ color: "#111827", fontWeight: 500 }}
                cursor={{ stroke: "#D1D5DB", strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              
              <Area
                type="monotone"
                dataKey="contacts"
                stroke="#111827"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorContacts)"
                activeDot={{ r: 6, fill: "#111827", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default ContactTrends;