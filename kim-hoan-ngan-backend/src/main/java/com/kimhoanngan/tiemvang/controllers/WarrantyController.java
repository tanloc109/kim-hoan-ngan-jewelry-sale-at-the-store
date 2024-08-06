package com.kimhoanngan.tiemvang.controllers;

import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddWarrantyDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseWarrantyDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateWarrantyDTO;
import com.kimhoanngan.tiemvang.services.servicesIMPL.WarrantyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/warranties")
public class WarrantyController{

    @Autowired
    private WarrantyService warrantyService;

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping
    public ResponseEntity<List<ResponseWarrantyDTO>> getAllWarranties(){
        List<ResponseWarrantyDTO> warrantyDTOs = warrantyService.findAll();
        return new ResponseEntity<>(warrantyDTOs, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping("/{id}")
    public ResponseEntity<Optional<ResponseWarrantyDTO>> getWarrantiesById(@PathVariable int id){
        Optional<ResponseWarrantyDTO> warrantyDTO = warrantyService.findById(id);
        return warrantyDTO.map(category -> new ResponseEntity<>(warrantyDTO, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

//    @PreAuthorize("hasRole('ROLE_MANAGER')")
//    @PostMapping
//    public ResponseEntity<ResponseWarrantyDTO> createWarranty(@RequestBody AddWarrantyDTO warrantyDTO){
//        try {
//            ResponseWarrantyDTO warranty = warrantyService.save(warrantyDTO);
//            return new ResponseEntity<>(warranty, HttpStatus.CREATED);
//        } catch (Exception e) {
//            return new ResponseEntity<>(HttpStatus.CONFLICT);
//        }
//    }

//    @PreAuthorize("hasRole('ROLE_MANAGER')")
//    @PutMapping("/{id}")
//    public ResponseEntity<ResponseWarrantyDTO> updateWarranty(@PathVariable int id, @RequestBody UpdateWarrantyDTO warrantyDTO) {
//        try {
//            ResponseWarrantyDTO updated = warrantyService.update(id, warrantyDTO);
//            return new ResponseEntity<>(updated, HttpStatus.OK);
//        } catch (RuntimeException e) {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable int id) {
        try {
            warrantyService.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @GetMapping("get-warranties-by-customer-phone")
    public ResponseEntity<List<ResponseWarrantyDTO>> getWarrantiesByCustomerPhone(@RequestParam String phone){
            List<ResponseWarrantyDTO> warrantyDTOs = warrantyService.findWarrantiesByCustomerPhone(phone);
            return new ResponseEntity<>(warrantyDTOs, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping("get-warranties-out-of-date")
    public ResponseEntity<List<ResponseWarrantyDTO>> getWarrantiesOutOfDate() {
        List<ResponseWarrantyDTO> warrantyDTOs = warrantyService.findAllWarrantyOutOfDate(new Date());
        return new ResponseEntity<>(warrantyDTOs, HttpStatus.OK);
    }
}
