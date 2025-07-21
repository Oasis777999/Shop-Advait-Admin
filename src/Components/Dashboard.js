import React, { useState } from "react";
import StatusSalesChart from "./StatusSalesChart";
import OrderCountPieChart from "./OrderCountPieChart";

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-end mb-3">
        <select
          className="form-select w-auto"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          <option value="">-- Yearly Summary --</option>
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>

      {/* Pass selectedMonth as prop */}
      <StatusSalesChart month={selectedMonth} />
      <OrderCountPieChart month={selectedMonth} />
    </div>
  );
};

export default Dashboard;
