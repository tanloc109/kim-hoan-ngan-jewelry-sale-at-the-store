package com.kimhoanngan.tiemvang.controllers;

import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddCartItemDTO;
import com.kimhoanngan.tiemvang.DTOs.addDTOs.CheckoutDTO;
import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddPaymentDTO;
import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddWarrantyDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseCartDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseOrderDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponsePaymentDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseWarrantyDTO;
import com.kimhoanngan.tiemvang.services.servicesIMPL.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@PreAuthorize("hasRole('ROLE_STAFF')")
public class CartController {

    @Autowired
    private CartService cartService;

    private String getUsername() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getUsername();
    }

    @GetMapping()
    public ResponseEntity<ResponseCartDTO> getCart() {
        try {
            String username = getUsername();
            ResponseCartDTO responseCartDTO = cartService.getCart(username);
            return ResponseEntity.ok(responseCartDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<ResponseCartDTO> addItemToCart(@RequestBody AddCartItemDTO addCartItemDTO) {
        try {
            String username = getUsername();
            ResponseCartDTO responseCartDTO = cartService.addItemToCart(username, addCartItemDTO);
            return ResponseEntity.ok(responseCartDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Void> removeItemFromCart(@PathVariable int productId, @RequestParam int quantity) {
        try {
            String username = getUsername();
            cartService.removeItemFromCart(username, productId, quantity);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/checkout")
    public ResponseEntity<ResponseOrderDTO> checkout(@RequestBody CheckoutDTO addOrderDTO) {
        try {
            String username = getUsername();
            ResponseOrderDTO responseOrderDTO = cartService.checkout(username, addOrderDTO);
            return ResponseEntity.ok(responseOrderDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/payment")
    public ResponseEntity<ResponsePaymentDTO> payment(@ModelAttribute AddPaymentDTO addPaymentDTO) {
        try {
            String username = getUsername();
            ResponsePaymentDTO responsePaymentDTO = cartService.payOrder(username, addPaymentDTO);
            return ResponseEntity.ok(responsePaymentDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/export-warranty")
    public ResponseEntity<List<ResponseWarrantyDTO>> exportWarranty(@RequestBody AddWarrantyDTO addWarrantyDTO) {
        try {
            String username = getUsername();
            List<ResponseWarrantyDTO> responseWarrantyDTOs = cartService.exportWarranty(username, addWarrantyDTO);
            return ResponseEntity.ok(responseWarrantyDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}
