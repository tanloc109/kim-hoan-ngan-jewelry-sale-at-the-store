package com.kimhoanngan.tiemvang.specifications;

import com.kimhoanngan.tiemvang.pojos.Product;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {

    public static Specification<Product> filterByField(String field, String value) {
        switch (field) {
            case "name":
                return (root, query, cb) -> cb.like(root.get("name"), "%" + value + "%");
            case "category":
                return (root, query, cb) -> cb.equal(root.get("category").get("name"), value);
            case "material":
                return (root, query, cb) -> cb.equal(root.get("material").get("name"), value);
            case "price":
                return (root, query, cb) -> cb.equal(root.get("price"), Double.parseDouble(value));
            case "quantity":
                return (root, query, cb) -> cb.equal(root.get("quantity"), Integer.parseInt(value));
            case "isActive":
                return (root, query, cb) -> cb.equal(root.get("isActive"), Boolean.valueOf(value));
            default:
                return null;
        }
    }
}
