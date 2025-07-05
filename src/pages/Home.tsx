import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "40px",
    height: "100vh"
  }}>
    <Link to="/products" style={{ textAlign: "center", textDecoration: "none" }}>
      <img src="/pcounter-front/products-svg-logo.svg" alt="Продукты" width={120} height={120} />
      <div style={{ marginTop: 12, fontSize: 18, color: "#333" }}>Продукты</div>
    </Link>
    <Link to="/orders" style={{ textAlign: "center", textDecoration: "none" }}>
      <img src="/pcounter-front/orders-svg-logo.svg" alt="Заказы" width={120} height={120} />
      <div style={{ marginTop: 12, fontSize: 18, color: "#333" }}>Заказы</div>
    </Link>
  </div> 
);

export default Home;
