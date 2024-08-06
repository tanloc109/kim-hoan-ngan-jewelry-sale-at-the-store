package com.kimhoanngan.tiemvang.controllers;

import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddPaymentDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponsePaymentDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdatePaymentDTO;
import com.kimhoanngan.tiemvang.services.servicesIMPL.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping
    public ResponseEntity<List<ResponsePaymentDTO>> findAllPayments() {
        List<ResponsePaymentDTO> payments = paymentService.findAll();
        return ResponseEntity.ok().body(payments);
    }

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping("/{id}")
    public ResponseEntity<Optional<ResponsePaymentDTO>> findPaymentById(@PathVariable Integer id) {
        Optional<ResponsePaymentDTO> paymentDTO = paymentService.findById(id);
        return paymentDTO.map(category -> new ResponseEntity<>(paymentDTO, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

//    @PreAuthorize("hasRole('ROLE_MANAGER')")
//    @PostMapping
//    public ResponseEntity<ResponsePaymentDTO> createPayment(@RequestBody AddPaymentDTO paymentDTO) {
//        try {
//            ResponsePaymentDTO payment = paymentService.save(paymentDTO);
//            return new ResponseEntity<>(payment, HttpStatus.CREATED);
//        } catch (Exception e) {
//            return new ResponseEntity<>(HttpStatus.CONFLICT);
//        }
//    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<ResponsePaymentDTO> updatePayment(@PathVariable Integer id, @ModelAttribute UpdatePaymentDTO paymentDTO) {
        try {
            ResponsePaymentDTO updatedCategory = paymentService.update(id, paymentDTO);
            return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletePayment(@PathVariable Integer id) {
        try {
            paymentService.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
