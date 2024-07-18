package com.kimhoanngan.tiemvang.pojos;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;
@Data
@Entity
@ToString
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(length = 7, columnDefinition = "char(7)")
    private String code;

    @Column(length = 30, columnDefinition = "nvarchar(30)")
    private String name;

    private String image;

    private float goldWeight;

    private int quantity;

    private double price;

    private String size;

    private int numOfWarranty;

    private double wage;

    private double priceStone;

    private boolean isActive;

    @OneToMany(mappedBy = "product")
    private List<Stone> stones = new ArrayList<>();

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Warranty> warranties = new ArrayList<>();

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", image='" + image + '\'' +
                ", goldWeight=" + goldWeight +
                ", quantity=" + quantity +
                ", price=" + price +
                ", size='" + size + '\'' +
                ", numOfWarranty=" + numOfWarranty +
                ", wage=" + wage +
                ", priceStone=" + priceStone +
                ", isActive=" + isActive +
                ", stones=" + stones +
                ", category=" + category +
                ", material=" + material +
                ", warranties=" + warranties +
                '}';
    }
}
