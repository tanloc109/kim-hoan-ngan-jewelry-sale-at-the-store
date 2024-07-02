package com.kimhoanngan.tiemvang.controllers;

import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddProductDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseProductDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateProductDTO;
import com.kimhoanngan.tiemvang.services.iservices.IProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private IProductService productService;

    @Value("${MAX_PAGESIZE}")
    private int MAX_PAGESIZE;

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping
    public ResponseEntity<Page<ResponseProductDTO>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) List<String> filterOn,
            @RequestParam(required = false) List<String> query,
            @RequestParam(defaultValue = "name") String[] sort) {

        List<Sort.Order> orders = new ArrayList<>();

        for (String sortParam : sort) {
            String[] sortParams = sortParam.split("-");
            String sortField = sortParams[0];
            String sortDirection = "asc";

            if (sortParams.length > 1) {
                sortDirection = sortParams[1];
            }

            if ("desc".equalsIgnoreCase(sortDirection)) {
                orders.add(new Sort.Order(Sort.Direction.DESC, sortField));
            } else {
                orders.add(new Sort.Order(Sort.Direction.ASC, sortField));
            }
        }

        Pageable pageable = PageRequest.of(page, size > MAX_PAGESIZE ? MAX_PAGESIZE : size, Sort.by(orders));

        if (filterOn == null || query == null || filterOn.size() != query.size()) {
            Page<ResponseProductDTO> productDTOs = productService.findAll(pageable);
            return new ResponseEntity<>(productDTOs, HttpStatus.OK);
        }

        Page<ResponseProductDTO> productDTOs = productService.findByCriteria(filterOn, query, pageable);
        return new ResponseEntity<>(productDTOs, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping("/{id}")
    public ResponseEntity<Optional<ResponseProductDTO>> getProductById(@PathVariable int id) {
        Optional<ResponseProductDTO> productDTO = productService.findById(id);
        return productDTO.map(product -> new ResponseEntity<>(productDTO, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PostMapping
    public ResponseEntity<ResponseProductDTO> createProduct(@RequestBody AddProductDTO productDTO) {
        try {
            ResponseProductDTO product = productService.save(productDTO);
            return new ResponseEntity<>(product, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<ResponseProductDTO> updateProduct(@PathVariable int id, @RequestBody UpdateProductDTO productDTO) {
        try {
            ResponseProductDTO updatedProduct = productService.update(id, productDTO);
            return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
        } catch (IOException | RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteProduct(@PathVariable int id) {
        try {
            productService.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping("/top-seller")
    public ResponseEntity<List<ResponseProductDTO>> getTop10ProductsBestSeller() {
        List<ResponseProductDTO> productDTOs = productService.getTop10ProductsBestSeller();
        return new ResponseEntity<>(productDTOs, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @PutMapping("/update-price/{id}")
    public ResponseEntity<ResponseProductDTO> updatePriceFollowPriceMaterial(@PathVariable int id) {
        ResponseProductDTO productDTO = productService.updatePriceFollowPriceMaterial(id);
        return new ResponseEntity<>(productDTO, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @PutMapping("/update-all-prices")
    public ResponseEntity<List<ResponseProductDTO>> updateAllPricesFollowPriceMaterial() {
        List<ResponseProductDTO> productDTOs = productService.updateAllPriceFollowPriceMaterial();
        return new ResponseEntity<>(productDTOs, HttpStatus.OK);
    }

}
