package com.kimhoanngan.tiemvang.controllers;
import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddCategoryDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseCategoryDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateCategoryDTO;
import com.kimhoanngan.tiemvang.services.servicesIMPL.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping
    public ResponseEntity<List<ResponseCategoryDTO>> getAllCategories() {
        List<ResponseCategoryDTO> categoryDTOs = categoryService.findAll();
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

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping("/get-categories-by-name")
    public ResponseEntity<List<ResponseCategoryDTO>> getCategoriesByName(@RequestParam String categoryName) {
        List<ResponseCategoryDTO> categoryDTOs = categoryService.findCategoiesByName(categoryName);
        return new ResponseEntity<>(categoryDTOs, HttpStatus.OK);
    }
}
