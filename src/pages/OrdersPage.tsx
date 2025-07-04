import { useEffect, useState } from "react";
import type { CartLine, Customer, Order, Product } from "../types";
import {
  fetchCustomers,
  fetchOrders,
  fetchProducts /*updateProductQuantities*/,
  hardDeleteOrder,
} from "../api";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import OrderList from "../components/Orders/OrdersList";
import { ErrorAlert } from "../components/ErrorAlert";
import OrderCard from "../components/Orders/OrderCard";
import EditOrderForm from "../components/Orders/EditOrderForm";
import { updateOrderCartLines, updateOrderStatus } from "../api";

const OrdersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchCustomers()
      .then((data) => {
        if (!data) throw new Error("Нет данных");
        setCustomers(data);
      })
      .catch(() => setError("Ошибка при загрузке заказчиков"));
  }, []);

  useEffect(() => {
    fetchOrders()
      .then((data) => setOrders(data.result.items))
      .catch((err) => {
        setError("Ошибка при загрузке продуктов");
        if (err.message.includes("401") || err.message.includes("403")) {
          navigate("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data.result.items))
      .catch((err) => {
        setError("Ошибка при загрузке продуктов");
        if (err.message.includes("401") || err.message.includes("403")) {
          navigate("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
  };

  const handleDelete = async (order: Order) => {
    if (window.confirm(`Удалить заказ №${order.orderNumber}?`)) {
      try {
        await hardDeleteOrder(order.customerId, order.id);
        alert(`Заказ ${order.orderNumber} удалён`);
        window.location.reload();
      } catch {
        alert("Ошибка при удалении заказа");
      }
    }
  };

  const handleSaveStatus = async (newStatus: number, isPaid: boolean) => {
    try {
      await updateOrderStatus(selectedOrder!.customerId, selectedOrder!.id, {
        status: newStatus,
        isPaid: isPaid,
      });
      window.location.href = "/orders";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
    }
  };

  const handleSaveCartLines = async (data: {
    cartLinesDtoForAdd: CartLine[] | null;
    cartLinesDtoForRemove: CartLine[] | null;
  }) => {
    try {
      await updateOrderCartLines(selectedOrder!.customerId, selectedOrder!.id, {
        cartLinesDtoForAdd: data.cartLinesDtoForAdd || [],
        cartLinesDtoForRemove: data.cartLinesDtoForRemove || [],
      });
      window.location.href = "/orders";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
    }
  };

  const filteredOrders = orders.filter((order) => {
    // Фильтр по архиву
    if (
      showArchived ? order.status !== "Shipped" : order.status === "Shipped"
    ) {
      return false;
    }

    // Фильтр по статусу
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }

    // Поиск по ФИО заказчика
    if (searchQuery.trim()) {
      const customer = customers.find((c) => c.id === order.customerId);
      if (!customer) return false;
      const { familyName, firstName, patronymic } = customer.name;
      const fullName = `${familyName} ${firstName} ${patronymic}`.toLowerCase();
      if (!fullName.includes(searchQuery.trim().toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  if (loading) return <LoadingSpinner />;

  if (error)
    return (
      <ErrorAlert
        message={error}
        onRetry={() => navigate("/login")}
        buttonText="Перейти к авторизации"
      />
    );

  if (editingOrder) {
    const customer = customers.find((c) => c.id === selectedOrder!.customerId);
    return (
      <EditOrderForm
        order={editingOrder}
        products={products}
        customer={customer}
        onClose={() => setEditingOrder(null)}
        onSaveStatus={handleSaveStatus}
        onSaveCartLines={handleSaveCartLines}
      />
    );
  }

  if (selectedOrder) {
    const customer = customers.find((c) => c.id === selectedOrder.customerId);
    return (
      <OrderCard
        order={selectedOrder}
        products={products}
        customer={customer}
        onBack={() => setSelectedOrder(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <div className="container mt-4">
      {/* Заголовок и кнопка добавления */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Список заказов</h2>
        <button
          className="btn btn-success"
          onClick={() => navigate("/order/new")}
        >
          Добавить
        </button>
      </div>

      {/* Панель фильтров и поиска */}
      <div className="card mb-4">
        <div className="card-body p-3">
          <div className="row g-2 align-items-center">
            <div className="col-md-5">
              <label className="form-label mb-1" htmlFor="searchOrder">
                Поиск по ФИО заказчика
              </label>
              <input
                id="searchOrder"
                type="text"
                className="form-control"
                placeholder="Введите фамилию, имя или отчество"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label mb-1" htmlFor="statusFilter">
                Статус заказа
              </label>
              <select
                id="statusFilter"
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Все статусы</option>
                <option value="CreatedOnly">Новый</option>
                <option value="Completed">Готов к отправке</option>
                <option value="Reserved">Бронь</option>
                <option value="PartlyReserved">Частичная бронь</option>
                <option value="Deferred">Готов отложен</option>
                <option value="Shipped">Отправлен</option>
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => setShowArchived(!showArchived)}
              >
                {showArchived ? "Актив" : "Архив"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Список заказов */}
      <OrderList
        orders={filteredOrders}
        customers={customers}
        onOrderClick={handleOrderClick}
      />
    </div>
  );
};

export default OrdersPage;
