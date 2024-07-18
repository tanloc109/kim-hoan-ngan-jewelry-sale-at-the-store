package com.kimhoanngan.tiemvang.specifications;

import com.kimhoanngan.tiemvang.pojos.Payment;
import org.springframework.data.jpa.domain.Specification;

import java.sql.Timestamp;

public class PaymentSpecification {

    public static Specification<Payment> filterByField(String field, String value) {
        switch (field) {
            case "code":
                return (root, query, cb) -> cb.like(root.get("code"), "%" + value + "%");
            case "type":
                return (root, query, cb) -> cb.like(root.get("type"), "%" + value + "%");
            case "paymentTime":
                return (root, query, cb) -> cb.equal(root.get("paymentTime"), Timestamp.valueOf(value));
            case "startPaymentTime":
                return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("paymentTime"), Timestamp.valueOf(value));
            case "endPaymentTime":
                return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("paymentTime"), Timestamp.valueOf(value));
            case "orderID":
                return (root, query, cb) -> cb.equal(root.get("order").get("id"), Integer.parseInt(value));
            default:
                return null;
        }
    }
}
