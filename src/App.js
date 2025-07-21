import "./App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import AddProduct from "./Components/AddProduct";
import Login from "./Components/Login";
import UpdateProduct from "./Components/UpdateProduct";
import Sidebar from "./Components/Sidebar";
import ProductList from "./Components/ProductList";
import React from "react";
import OrdersPage from "./Components/OrdersPage";
import StatusSalesChart from "./Components/Dashboard";
import Dashboard from "./Components/Dashboard";

// Wrapper to handle Sidebar logic
const Layout = ({ children }) => {
  const location = useLocation();
  const hideSidebarRoutes = ["/login"]; // hide Sidebar on login page

  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="d-flex">
      {!shouldHideSidebar && <Sidebar />}
      <div className="flex-grow-1 bg-light min-vh-100 p-3">{children}</div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />

          {/* Admin */}
          <Route path="/" element={<Dashboard/>}></Route>
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/productlist" element={<ProductList />} />
          <Route path="/orderlist" element={<OrdersPage/>}></Route>
          <Route path="/updateproduct/:id" element={<UpdateProduct />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
