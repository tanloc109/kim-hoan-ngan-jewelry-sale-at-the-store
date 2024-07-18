package com.kimhoanngan.tiemvang.specifications;

import com.kimhoanngan.tiemvang.pojos.Product;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {

    public static Specification<Product> filterByField(String field, String value) {
        switch (field) {
            case "id":
                return (root, query, cb) -> cb.equal(root.get("id"), Integer.parseInt(value));
            case "name":
                return (root, query, cb) -> cb.like(root.get("name"), "%" + value + "%");
            case "categoryID":
                return (root, query, cb) -> cb.equal(root.get("category").get("id"), Integer.parseInt(value));
            case "materialID":
                return (root, query, cb) -> cb.equal(root.get("material").get("id"), Integer.parseInt(value));
            case "price":
                return (root, query, cb) -> cb.equal(root.get("price"), Double.parseDouble(value));
            case "minPrice":
                return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("price"), Double.parseDouble(value));
            case "maxPrice":
                return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("price"), Double.parseDouble(value));
            default:
                return null;
        }
    }
}
