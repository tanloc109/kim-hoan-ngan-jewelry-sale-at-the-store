package com.kimhoanngan.tiemvang.pojos;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

@Data
@Entity
@Table(name = "materials")
public class Material {

    @Id
    private String id;

    @Column(length = 50)
    private String name;

    private double buyPrice;

    private double sellPrice;

    private Timestamp timeUpdate;

    public boolean isActive;

    @OneToMany(mappedBy = "material", fetch = FetchType.LAZY)
    private List<Product> products;

    @PrePersist
    protected void onCreate() {
        timeUpdate = Timestamp.from(Instant.now());
    }

    @PreUpdate
    protected void onUpdate() {
        timeUpdate = Timestamp.from(Instant.now());
    }

    @Override
    public String toString() {
        return "Material{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", buyPrice=" + buyPrice +
                ", sellPrice=" + sellPrice +
                ", timeUpdate=" + timeUpdate +
                ", isActive=" + isActive +
                '}';
    }
}
