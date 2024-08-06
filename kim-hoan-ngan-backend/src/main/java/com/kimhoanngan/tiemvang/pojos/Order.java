package com.kimhoanngan.tiemvang.pojos;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Data
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(length = 7, columnDefinition = "nvarchar(7)")
    private String code;

    private Timestamp orderTime;

    private int totalQuantity;

    private double total;

    @Column(length = 50, columnDefinition = "nvarchar(50)")
    private String status;

    private String saleStaff;

    private String cashierStaff;

    private String serviceStaff;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderDetail> orderDetails;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Payment> payments;

    @Override
    public String toString() {
        return "Order{" +
                "id=" + id +
                ", orderTime=" + orderTime +
                ", totalQuantity=" + totalQuantity +
                ", total=" + total +
                ", status='" + status + '\'' +
                ", saleStaff='" + saleStaff + '\'' +
                ", cashierStaff='" + cashierStaff + '\'' +
                ", serviceStaff='" + serviceStaff + '\'' +
                ", customer=" + customer +
                ", user=" + user +
                '}';
    }
}
