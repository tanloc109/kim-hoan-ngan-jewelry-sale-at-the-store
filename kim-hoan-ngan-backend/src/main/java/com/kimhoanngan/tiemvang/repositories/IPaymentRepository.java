package com.kimhoanngan.tiemvang.repositories;
import com.kimhoanngan.tiemvang.pojos.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IPaymentRepository extends JpaRepository<Payment, Integer> {
}
