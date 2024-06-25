package com.kimhoanngan.tiemvang.controllers;

import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseOrderDetailDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateOrderDetailDTO;
import com.kimhoanngan.tiemvang.services.servicesIMPL.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/order-details")
public class OrderDetailController {

    @Autowired
    private OrderDetailService orderDetailService;

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping
    public ResponseEntity<List<ResponseOrderDetailDTO>> getAllOrderDetails() {
        List<ResponseOrderDetailDTO> orderDetailDTOs = orderDetailService.findAll();
        return ResponseEntity.ok(orderDetailDTOs);
    }

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping("/{id}")
    public ResponseEntity<Optional<ResponseOrderDetailDTO>> getOrderDetailById(@PathVariable int id) {
        Optional<ResponseOrderDetailDTO> orderDetailDTO = orderDetailService.findById(id);
        return orderDetailDTO.map(category -> new ResponseEntity<>(orderDetailDTO, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<ResponseOrderDetailDTO> updateOrder(@PathVariable int id, @RequestBody UpdateOrderDetailDTO orderDetailDTO) {
        try {
            orderDetailDTO.setId(id);
            ResponseOrderDetailDTO updatedOrder = orderDetailService.update(id, orderDetailDTO);
            return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteOrderDetail(@PathVariable int id) {
        try {
            orderDetailService.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
