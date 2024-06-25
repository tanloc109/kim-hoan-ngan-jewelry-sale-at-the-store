package com.kimhoanngan.tiemvang.repositories;

import com.kimhoanngan.tiemvang.pojos.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ICustomerRepository extends JpaRepository<Customer,Integer> {

    List<Customer> findByPhoneContaining(String number);

}
