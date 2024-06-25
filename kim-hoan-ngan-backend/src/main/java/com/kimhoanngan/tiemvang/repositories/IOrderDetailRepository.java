package com.kimhoanngan.tiemvang.repositories;

import com.kimhoanngan.tiemvang.pojos.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IOrderDetailRepository extends JpaRepository<OrderDetail, Integer> {

    @Query("SELECT MAX(o.orderDetailId) FROM OrderDetail o")
    public int getMaxOrderDetailId();

    List<OrderDetail> findByOrderId(int orderId);
}
