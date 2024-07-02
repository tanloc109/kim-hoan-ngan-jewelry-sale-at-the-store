package com.kimhoanngan.tiemvang.controllers;

import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddCustomerDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseCustomerDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateCustomerDTO;
import com.kimhoanngan.tiemvang.services.servicesIMPL.CustomerService;
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
@RequestMapping("/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @Value("${MAX_PAGESIZE}")
    private int MAX_PAGESIZE;

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping
    public ResponseEntity<Page<ResponseCustomerDTO>> getAllCustomers(
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
            Page<ResponseCustomerDTO> customerDTOs = customerService.findAll(pageable);
            return new ResponseEntity<>(customerDTOs, HttpStatus.OK);
        }

        Page<ResponseCustomerDTO> customerDTOs = customerService.findByCriteria(filterOn, query, pageable);
        return new ResponseEntity<>(customerDTOs, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping("/{id}")
    public ResponseEntity<Optional<ResponseCustomerDTO>> getCustomerById(@PathVariable int id) {
        Optional<ResponseCustomerDTO> customerDTO = customerService.findById(id);
        return customerDTO.map(customer -> new ResponseEntity<>(customerDTO, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PostMapping
    public ResponseEntity<ResponseCustomerDTO> createCustomer(@RequestBody AddCustomerDTO customerDTO) {
        try {
            ResponseCustomerDTO customer = customerService.save(customerDTO);
            return new ResponseEntity<>(customer, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<ResponseCustomerDTO> updateCustomer(@PathVariable int id, @RequestBody UpdateCustomerDTO customerDTO) {
        try {
            ResponseCustomerDTO updatedCustomer = customerService.update(id, customerDTO);
            return new ResponseEntity<>(updatedCustomer, HttpStatus.OK);
        } catch (RuntimeException e) {
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
}
