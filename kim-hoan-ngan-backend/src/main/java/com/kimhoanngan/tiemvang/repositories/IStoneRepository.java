package com.kimhoanngan.tiemvang.repositories;
import com.kimhoanngan.tiemvang.pojos.Stone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IStoneRepository extends JpaRepository<Stone, Integer> {

    @Query("SELECT s FROM Stone s WHERE s.product.id = :productId")
    List<Stone> findStonesByProductId(int productId);

    List<Stone> findByNameContaining(String name);
}
