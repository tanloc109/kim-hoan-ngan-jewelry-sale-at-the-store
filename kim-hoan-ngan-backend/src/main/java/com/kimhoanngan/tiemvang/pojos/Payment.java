package com.kimhoanngan.tiemvang.pojos;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Data
@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String type;

    private double cash;

    private double bank;

    private double bankingCode;

    private Timestamp paymentTime;

    private String bankImage;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Override
    public String toString() {
        return "Payment{" +
                "id=" + id +
                ", type='" + type + '\'' +
                ", cash=" + cash +
                ", bank=" + bank +
                ", bankingCode=" + bankingCode +
                ", paymentTime=" + paymentTime +
                ", bankImage='" + bankImage + '\'' +
                '}';
    }
}
