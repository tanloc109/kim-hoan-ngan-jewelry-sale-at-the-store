package com.kimhoanngan.tiemvang.specifications;

import com.kimhoanngan.tiemvang.pojos.Customer;
import org.springframework.data.jpa.domain.Specification;

public class CustomerSpecification {
    public static Specification<Customer> filterByField(String field, String value) {
        switch (field) {
            case "name":
                return (root, query, cb) -> cb.like(root.get("name"), "%" + value + "%");
            case "phone":
                return (root, query, cb) -> cb.like(root.get("phone"), "%" + value + "%");
            case "email":
                return (root, query, cb) -> cb.like(root.get("email"), "%" + value + "%");
            case "isActive":
                return (root, query, cb) -> cb.equal(root.get("isActive"), Boolean.parseBoolean(value));
            default:
                return null;
        }
    }
}
