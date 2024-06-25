package com.kimhoanngan.tiemvang.controllers;

import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddProductDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseProductDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateProductDTO;
import com.kimhoanngan.tiemvang.services.servicesIMPL.ProductService;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping
    public ResponseEntity<List<ResponseProductDTO>> getAllProducts() {
        List<ResponseProductDTO> productDTOs = productService.findAll();
        return ResponseEntity.ok(productDTOs);
    }

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping("/{id}")
    public ResponseEntity<Optional<ResponseProductDTO>> getProductById(@PathVariable int id) {
        Optional<ResponseProductDTO> productDTO = productService.findById(id);
        return productDTO.map(category -> new ResponseEntity<>(productDTO, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PostMapping
    public ResponseEntity<ResponseProductDTO> createProduct(@ModelAttribute AddProductDTO productDTO) {
        try {
            ResponseProductDTO product = productService.save(productDTO);
            return new ResponseEntity<>(product, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<ResponseProductDTO> updateProduct(@PathVariable int id, @ModelAttribute UpdateProductDTO productDTO) {
        try {
            productDTO.setId(id);
            ResponseProductDTO updatedProduct = productService.update(id, productDTO);
            return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
        } catch (RuntimeException | IOException e) {
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
    @GetMapping("/get-top-10-product-best-seller")
    public ResponseEntity<List<ResponseProductDTO>> getTop10ProductsBestSeller() {
        List<ResponseProductDTO> productDTOs = productService.getTop10ProductsBestSeller();
        return ResponseEntity.ok(productDTOs);
    }

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping("/get-product-out-of-stock")
    public ResponseEntity<List<ResponseProductDTO>> getProductsOutOfStock() {
        List<ResponseProductDTO> productDTOs = productService.findAllProductsOutOfStock();
        return ResponseEntity.ok(productDTOs);
    }

    @PutMapping("update-product-price-follow-material-price/{id}")
    public ResponseEntity<ResponseProductDTO> updateProductPriceFollowMaterialPrice(@PathVariable int id) {
        ResponseProductDTO productDTO = productService.updatePriceFollowPriceMaterial(id);
        return new ResponseEntity<>(productDTO, HttpStatus.OK);
    }

    @PutMapping("update-all-prices-follow-material-price")
    public ResponseEntity<List<ResponseProductDTO>> updateAllPriceFollowMaterialPrice() {
        List<ResponseProductDTO> productDTOs = productService.updateAllPriceFollowPriceMaterial();
        return ResponseEntity.ok(productDTOs);
    }

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping("get-products-by-name-or-id")
    public ResponseEntity<List<ResponseProductDTO>> getProductsByNameOrId(@RequestParam String searchKey) {
        List<ResponseProductDTO> productDTOs = productService.getProductsBySearchKey(searchKey);
        return ResponseEntity.ok(productDTOs);
    }
}
