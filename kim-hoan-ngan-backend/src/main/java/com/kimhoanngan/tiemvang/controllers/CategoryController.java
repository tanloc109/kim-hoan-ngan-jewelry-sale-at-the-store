package com.kimhoanngan.tiemvang.controllers;
import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddCategoryDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseCategoryDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateCategoryDTO;
import com.kimhoanngan.tiemvang.services.servicesIMPL.CategoryService;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @Value("${MAX_PAGESIZE}")
    private int MAX_PAGESIZE;

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping
    public ResponseEntity<Page<ResponseCategoryDTO>> getAllCategories(
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
            Page<ResponseCategoryDTO> categoryDTOs = categoryService.findAll(pageable);
            return new ResponseEntity<>(categoryDTOs, HttpStatus.OK);
        }

        Page<ResponseCategoryDTO> categoryDTOs = categoryService.findByCriteria(filterOn, query, pageable);
        return new ResponseEntity<>(categoryDTOs, HttpStatus.OK);
    }


    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping("/{id}")
    public ResponseEntity<Optional<ResponseCategoryDTO>> getCategoryById(@PathVariable int id) {
        Optional<ResponseCategoryDTO> categoryDTO = categoryService.findById(id);
        return categoryDTO.map(category -> new ResponseEntity<>(categoryDTO, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PostMapping
    public ResponseEntity<ResponseCategoryDTO> createCategory(@RequestBody AddCategoryDTO categoryDTO) {
        try {
            ResponseCategoryDTO category = categoryService.save(categoryDTO);
            return new ResponseEntity<>(category, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<ResponseCategoryDTO> updateCategory(@PathVariable int id, @RequestBody UpdateCategoryDTO categoryDTO) {
        try {
            ResponseCategoryDTO updatedCategory = categoryService.update(id, categoryDTO);
            return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable int id) {
        try {
            categoryService.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
