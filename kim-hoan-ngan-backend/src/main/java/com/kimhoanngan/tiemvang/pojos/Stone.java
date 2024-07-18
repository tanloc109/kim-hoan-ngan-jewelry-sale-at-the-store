package com.kimhoanngan.tiemvang.pojos;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "stones")
public class Stone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(length = 7, columnDefinition = "char(7)")
    private String code;

    @Column(length = 30, columnDefinition = "nvarchar(30)")
    private String name;

    @Column(length = 30, columnDefinition = "nvarchar(30)")
    private String type;

    @Column(length = 30, columnDefinition = "nvarchar(30)")
    private String color;

    private double price;

    private boolean isPrimary;

    private boolean isActive;

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "product_id")
    private Product product;

    @Override
    public String toString() {
        return "Stone{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", color='" + color + '\'' +
                ", price=" + price +
                ", isPrimary=" + isPrimary +
                ", isActive=" + isActive +
                '}';
    }
}
