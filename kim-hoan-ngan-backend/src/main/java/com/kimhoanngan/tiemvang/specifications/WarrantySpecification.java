package com.kimhoanngan.tiemvang.specifications;

import com.kimhoanngan.tiemvang.pojos.Warranty;
import org.springframework.data.jpa.domain.Specification;

public class WarrantySpecification {

    public static Specification<Warranty> filterByField(String field, String value) {
        switch (field) {
            case "code":
                return (root, query, cb) -> cb.like(root.get("code"), "%" + value + "%");
            case "customerName":
                return (root, query, cb) -> cb.like(root.get("customer").get("name"), "%" + value + "%");
            case "productID":
                return (root, query, cb) -> cb.equal(root.get("product").get("id"), Integer.parseInt(value));
            default:
                return null;
        }
    }
}
