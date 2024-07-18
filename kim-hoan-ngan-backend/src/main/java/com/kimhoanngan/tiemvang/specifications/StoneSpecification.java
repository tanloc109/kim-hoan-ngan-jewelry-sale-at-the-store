package com.kimhoanngan.tiemvang.specifications;

import com.kimhoanngan.tiemvang.pojos.Stone;
import org.springframework.data.jpa.domain.Specification;

public class StoneSpecification {

    public static Specification<Stone> filterByField(String field, String value) {
        switch (field) {
            case "code":
                return (root, query, cb) -> cb.like(root.get("code"), "%" + value + "%");
            case "name":
                return (root, query, cb) -> cb.like(root.get("name"), "%" + value + "%");
            case "color":
                return (root, query, cb) -> cb.like(root.get("color"), "%" + value + "%");
            case "productID":
                return (root, query, cb) -> cb.equal(root.get("product").get("id"), Integer.parseInt(value));
            default:
                return null;
        }
    }
}
