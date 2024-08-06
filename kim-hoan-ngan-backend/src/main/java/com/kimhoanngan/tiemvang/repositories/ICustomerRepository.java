package com.kimhoanngan.tiemvang.repositories;

import com.kimhoanngan.tiemvang.pojos.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ICustomerRepository extends JpaRepository<Customer,Integer>, JpaSpecificationExecutor<Customer> {
    Page<Customer> findAll(Pageable pageable);

    Customer findByPhone(String phone);
}
