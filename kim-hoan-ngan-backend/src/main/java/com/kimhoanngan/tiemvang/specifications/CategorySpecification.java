package com.kimhoanngan.tiemvang.specifications;

import com.kimhoanngan.tiemvang.pojos.Category;
import org.springframework.data.jpa.domain.Specification;

public class CategorySpecification {

    public static Specification<Category> filterByField(String field, String value) {
        return (root, query, criteriaBuilder) -> {
            switch (field) {
                case "id":
                    return criteriaBuilder.equal(root.get(field), Integer.parseInt(value));
                case "name", "code":
                    return criteriaBuilder.like(root.get(field), "%" + value + "%");
                default:
                    return null;
            }
        };
    }

}
