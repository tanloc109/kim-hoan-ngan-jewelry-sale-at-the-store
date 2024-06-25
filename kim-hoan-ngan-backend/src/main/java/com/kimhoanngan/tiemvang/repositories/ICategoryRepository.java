package com.kimhoanngan.tiemvang.repositories;

import com.kimhoanngan.tiemvang.pojos.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ICategoryRepository extends JpaRepository<Category,Integer> {

    List<Category> findByNameContaining(String searchKey);

}
