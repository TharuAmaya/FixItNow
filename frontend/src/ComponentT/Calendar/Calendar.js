import React, { useState } from "react";
import "./Calendar.css";

function Calendar({ orders }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = firstDayOfMonth.getDay();

  // ✅ Group orders by local date
  const ordersByDate = {};
  orders.forEach(order => {
    const dateObj = new Date(order.deliveryDate || order.createdAt);
    const orderDate = dateObj.toLocaleDateString("en-CA"); // (local)
    if (!ordersByDate[orderDate]) ordersByDate[orderDate] = [];
    ordersByDate[orderDate].push(order);
  });

  const handleDayClick = (date) => {
    const isoDate = date.toLocaleDateString("en-CA"); // local date
    setSelectedDate({
      date: isoDate,
      orders: ordersByDate[isoDate] || []
    });
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(null);
  };

  const getStatusCounts = (dateOrders) => {
    const counts = { accepted: 0, pending: 0, rejected: 0 };
    dateOrders.forEach(order => {
      if (order.responseType === "accept") counts.accepted++;
      else if (order.responseType === "reject") counts.rejected++;
      else counts.pending++;
    });
    return counts;
  };

  const getDominantStatus = (dateOrders) => {
    const counts = getStatusCounts(dateOrders);
    if (counts.accepted >= counts.pending && counts.accepted >= counts.rejected) return "accepted";
    if (counts.pending >= counts.rejected) return "pending";
    return "rejected";
  };

  const renderCalendarHeader = () => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    return (
      <div className="calendar-header">
        <div className="calendar-navigation">
          <button className="nav-button" onClick={() => navigateMonth(-1)}>
            ←
          </button>
          <h2 className="calendar-title">
            {monthNames[month]} {year}
          </h2>
          <button className="nav-button" onClick={() => navigateMonth(1)}>
            →
          </button>
        </div>
        <button className="today-button" onClick={goToToday}>
          Today
        </button>
      </div>
    );
  };

  const renderDayHeaders = () => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayNames.map(day => (
      <div key={day} className="calendar-day-header">
        {day}
      </div>
    ));
  };

  const renderDays = () => {
    const days = [];
    
    // Empty days start of month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of month
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const isoDate = currentDate.toLocaleDateString("en-CA"); //local date
      const dayOrders = ordersByDate[isoDate] || [];
      const isToday = currentDate.toDateString() === today.toDateString();
      
      let statusClass = "";
      let orderCount = 0;

      if (dayOrders.length > 0) {
        statusClass = getDominantStatus(dayOrders);
        orderCount = dayOrders.length;
      }

      days.push(
        <div
          key={i}
          className={`calendar-day ${isToday ? "today" : ""} ${
            dayOrders.length > 0 ? "has-orders " + statusClass : ""
          } ${selectedDate && selectedDate.date === isoDate ? "selected" : ""}`}
          onClick={() => handleDayClick(currentDate)}
        >
          <span className="day-number">{i}</span>
          {dayOrders.length > 0 && (
            <div className="order-badge">
              {orderCount}
            </div>
          )}
          {isToday && <div className="today-indicator"></div>}
        </div>
      );
    }
    return days;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accept": return "✅";
      case "reject": return "❌";
      default: return "⏳";
    }
  };

  return (
    <div className="calendar">
      {renderCalendarHeader()}
      
      <div className="calendar-grid">
        {renderDayHeaders()}
        {renderDays()}
      </div>

      {selectedDate && selectedDate.orders.length > 0 && (
        <div className="order-details">
          <div className="order-details-header">
            <h3>Orders for {formatDate(selectedDate.date)}</h3>
            <span className="order-count">{selectedDate.orders.length} order(s)</span>
          </div>
          
          <div className="orders-list">
            {selectedDate.orders.map((order, idx) => (
              <div key={idx} className="order-item">
                <div className="order-main-info">
                  <span className="order-id">Order #{order.orderId}</span>
                  <span className={`order-status ${order.responseType}`}>
                    {getStatusIcon(order.responseType)} {order.responseType || "pending"}
                  </span>
                </div>
                {order.customerName && (
                  <div className="order-customer">Customer: {order.customerName}</div>
                )}
                {order.items && (
                  <div className="order-items">
                    Items: {order.items.length} item(s)
                  </div>
                )}
                {order.totalAmount && (
                  <div className="order-amount">
                    Total: ${parseFloat(order.totalAmount).toFixed(2)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedDate && selectedDate.orders.length === 0 && (
        <div className="order-details empty">
          <div className="no-orders-message">
             No orders scheduled for {formatDate(selectedDate.date)}
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
