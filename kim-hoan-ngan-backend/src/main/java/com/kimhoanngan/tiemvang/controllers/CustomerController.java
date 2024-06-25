package com.kimhoanngan.tiemvang.controllers;
import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddCustomerDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseCustomerDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateCustomerDTO;
import com.kimhoanngan.tiemvang.services.servicesIMPL.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping
    public ResponseEntity<List<ResponseCustomerDTO>> getAllCustomers() {
        List<ResponseCustomerDTO> customerDTOs = customerService.findAll();
        return ResponseEntity.ok(customerDTOs);
    }

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping("{id}")
    public ResponseEntity<Optional<ResponseCustomerDTO>> getCustomerById(@PathVariable int id) {
        Optional<ResponseCustomerDTO> customerDTO = customerService.findById(id);
        return customerDTO.map(customer -> new ResponseEntity<>(customerDTO, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PostMapping()
    public ResponseEntity<ResponseCustomerDTO> createCustomer(@RequestBody AddCustomerDTO customerDTO) {
        try {
            ResponseCustomerDTO customer = customerService.save(customerDTO);
            return new ResponseEntity<>(customer, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<ResponseCustomerDTO> updateCustomer(@PathVariable int id, @RequestBody UpdateCustomerDTO customerDTO) {
        try {
            ResponseCustomerDTO customer = customerService.update(id, customerDTO);
            return new ResponseEntity<>(customer, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteCustomer(@PathVariable int id) {
        try {
            customerService.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping("/get-customers-by-phone-number")
    public ResponseEntity<List<ResponseCustomerDTO>> getAllCustomers(@RequestParam String phoneNumber) {
        List<ResponseCustomerDTO> customerDTOs = customerService.findCustomersByPhoneNumber(phoneNumber);
        return ResponseEntity.ok(customerDTOs);
    }
}
