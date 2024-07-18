package com.kimhoanngan.tiemvang.specifications;

import com.kimhoanngan.tiemvang.pojos.User;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecification {

    public static Specification<User> filterByField(String field, String value) {
        switch (field) {
            case "username":
                return (root, query, cb) -> cb.like(root.get("username"), "%" + value + "%");
            case "fullName":
                return (root, query, cb) -> cb.like(root.get("fullName"), "%" + value + "%");
            case "phone":
                return (root, query, cb) -> cb.like(root.get("phone"), "%" + value + "%");
            case "email":
                return (root, query, cb) -> cb.like(root.get("email"), "%" + value + "%");
            case "level":
                return (root, query, cb) -> cb.equal(root.get("level"), Integer.parseInt(value));
            case "role":
                return (root, query, cb) -> cb.equal(root.get("role").get("id"), "%" + value + "%");
            default:
                return null;
        }
    }
}
