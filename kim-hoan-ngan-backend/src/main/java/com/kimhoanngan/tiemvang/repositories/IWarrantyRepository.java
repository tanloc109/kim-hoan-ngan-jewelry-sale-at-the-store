package com.kimhoanngan.tiemvang.repositories;

import com.kimhoanngan.tiemvang.pojos.Warranty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface IWarrantyRepository extends JpaRepository<Warranty, Integer> {

    @Query("SELECT w FROM Warranty w INNER JOIN w.customer c WHERE c.phone = :phone")
    List<Warranty> findWarrantiesByCustomerPhone(@Param("phone") String phone);

    @Query("SELECT w FROM Warranty w WHERE w.endDate < :newDate")
    List<Warranty> findWarrantiesOutOfDate(@Param("newDate") Date newDate);
}
