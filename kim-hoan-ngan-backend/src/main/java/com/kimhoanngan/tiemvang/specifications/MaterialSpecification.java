package com.kimhoanngan.tiemvang.specifications;

import com.kimhoanngan.tiemvang.pojos.Material;
import org.springframework.data.jpa.domain.Specification;

public class MaterialSpecification {

    public static Specification<Material> filterByField(String field, String value) {
        switch (field) {
            case "name", "id":
                return (root, query, cb) -> cb.like(root.get(field), "%" + value + "%");
            default:
                return null;
        }
    }
}
