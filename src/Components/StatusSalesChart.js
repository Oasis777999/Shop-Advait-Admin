import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import api from "../apis/api";

const StatusSalesChart = ({month}) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = month
          ? `/api/order/status-sales-summary?month=${month}`
          : `/api/order/status-sales-summary`;
        const res = await api.get(url);
        setChartData(res.data);
      } catch (error) {
        console.error("Error fetching chart data:", error.message);
      }
    };
    fetchData();
  }, [month]);

  return (
    <div className="container my-4">
      <div className="card shadow rounded-4">
        <div className="card-header bg-success text-white text-center">
          <h4 className="mb-0">Total Sell Price by Order Status</h4>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalSell" fill="#0d6efd" name="Total Sell Price">
                <LabelList dataKey="totalSell" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatusSalesChart;
