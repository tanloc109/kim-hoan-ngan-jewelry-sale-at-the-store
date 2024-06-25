package com.kimhoanngan.tiemvang.controllers;
import com.kimhoanngan.tiemvang.DTOs.generalsDTOs.MaterialDTO;
import com.kimhoanngan.tiemvang.services.servicesIMPL.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/materials")
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping
    public ResponseEntity<List<MaterialDTO>> findAll() {
        List<MaterialDTO> materialDTOs = materialService.findAll();
        return new ResponseEntity<>(materialDTOs, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping("/{id}")
    public ResponseEntity<Optional<MaterialDTO>> findById(@PathVariable String id) {
        Optional<MaterialDTO> materialDTO = materialService.findById(id);
        return materialDTO.map(category -> new ResponseEntity<>(materialDTO, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PostMapping
    public ResponseEntity<MaterialDTO> save(@RequestBody MaterialDTO materialDTO) {
        try {
            MaterialDTO material = materialService.save(materialDTO);
            return new ResponseEntity<>(material, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<MaterialDTO> update(@PathVariable String id, @RequestBody MaterialDTO materialDTO) {
        try {
            MaterialDTO updatedMaterial = materialService.update(id, materialDTO);
            return new ResponseEntity<>(updatedMaterial, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable String id) {
        try {
            materialService.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping("get-materials-by-name")
    public ResponseEntity<List<MaterialDTO>> findMaterialsByName(@RequestParam String name) {
        List<MaterialDTO> materialDTOs = materialService.findMaterialsByName(name);
        return new ResponseEntity<>(materialDTOs, HttpStatus.OK);
    }

}
