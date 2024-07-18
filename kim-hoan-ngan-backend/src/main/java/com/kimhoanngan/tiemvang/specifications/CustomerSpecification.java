package com.kimhoanngan.tiemvang.specifications;

import com.kimhoanngan.tiemvang.pojos.Customer;
import org.springframework.data.jpa.domain.Specification;

public class CustomerSpecification {
    public static Specification<Customer> filterByField(String field, String value) {
        switch (field) {
            case "id":
                return (root, query, cb) -> cb.equal(root.get("id"), Integer.parseInt(value));
            case "name", "phone", "email":
                return (root, query, cb) -> cb.like(root.get(field), "%" + value + "%");
            default:
                return null;
        }
    }
}
