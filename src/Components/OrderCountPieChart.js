import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../apis/api";

const COLORS = ["#0d6efd", "#ffc107", "#20c997", "#dc3545", "#6f42c1"];

const OrderStatusPieChart = ({ month }) => {
  const [data, setData] = useState([]);
  

  useEffect(() => {
    const fetchOrderCounts = async () => {
      try {
        const url = month
          ? `/api/order/status-sales-summary?month=${month}`
          : `/api/order/status-sales-summary`;

        const res = await api.get(url); // this should return [{ _id: "Delivered", count: 5 }, ...]
        console.log(res.data);

        setData(res.data);
      } catch (err) {
        console.error("Error fetching order count summary:", err.message);
      }
    };

    fetchOrderCounts();
  }, [month]);

  return (
    <div className="container my-4">
      <div className="card shadow rounded-4">
        <div className="card-header bg-success text-white text-center">
          <h4 className="mb-0">Order Count by Status</h4>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={130}
                label={({ _id, count }) => `${_id}: ${count}`} // 👈 show the status directly on each slice
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusPieChart;
