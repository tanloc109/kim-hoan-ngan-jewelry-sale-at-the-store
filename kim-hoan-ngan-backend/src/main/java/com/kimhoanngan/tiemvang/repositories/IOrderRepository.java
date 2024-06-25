package com.kimhoanngan.tiemvang.repositories;

import com.kimhoanngan.tiemvang.pojos.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IOrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findByStatus(String status);

    @Query(value = "SELECT * FROM orders WHERE CAST(order_time AS DATE) = CAST(GETDATE() AS DATE)", nativeQuery = true)
    List<Order> findOrdersToday();

    @Query(value = "SELECT * FROM orders WHERE DATEPART(YEAR, order_time) = DATEPART(YEAR, GETDATE()) AND DATEPART(WEEK, order_time) = DATEPART(WEEK, GETDATE())", nativeQuery = true)
    List<Order> findOrdersThisWeek();

    @Query(value = "SELECT * FROM orders WHERE DATEPART(YEAR, order_time) = DATEPART(YEAR, GETDATE()) AND DATEPART(MONTH, order_time) = DATEPART(MONTH, GETDATE())", nativeQuery = true)
    List<Order> findOrdersThisMonth();

    @Query(value = "SELECT * FROM orders WHERE DATEPART(YEAR, order_time) = DATEPART(YEAR, GETDATE())", nativeQuery = true)
    List<Order> findOrdersThisYear();
}
