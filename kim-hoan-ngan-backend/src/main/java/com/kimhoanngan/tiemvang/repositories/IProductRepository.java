    package com.kimhoanngan.tiemvang.repositories;

    import com.kimhoanngan.tiemvang.pojos.Product;
    import org.springframework.data.domain.Page;
    import org.springframework.data.domain.Pageable;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
    import org.springframework.data.jpa.repository.Query;
    import org.springframework.stereotype.Repository;

    import java.util.List;

    @Repository
    public interface IProductRepository extends JpaRepository<Product, Integer>, JpaSpecificationExecutor<Product> {

        Page<Product> findAll(Pageable pageable);

        @Query("SELECT p FROM Product p WHERE p.quantity = 0")
        List<Product> getProductOutOfStock();

        @Query("SELECT p FROM Product p WHERE CAST(p.id AS string) LIKE %:search% OR p.name LIKE %:search%")
        List<Product> findProductBySearch(String search);

        @Query(value = "SELECT p.* FROM products p INNER JOIN (\n" +
                "    SELECT TOP 10 o.product_id\n" +
                "    FROM order_details o\n" +
                "    GROUP BY o.product_id\n" +
                "    ORDER BY SUM(o.quantity) DESC\n" +
                ") AS TopProducts ON p.id = TopProducts.product_id;", nativeQuery = true)
        List<Product> getTopBestSeller();

        int findTopByOrderByIdDesc();
    }
