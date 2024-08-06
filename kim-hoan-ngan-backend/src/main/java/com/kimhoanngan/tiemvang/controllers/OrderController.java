package com.kimhoanngan.tiemvang.controllers;

import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseOrderDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseOrderDetailDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateOrderDTO;
import com.kimhoanngan.tiemvang.services.servicesIMPL.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping
    public ResponseEntity<List<ResponseOrderDTO>> getAllOrders() {
        List<ResponseOrderDTO> orderDTOs = orderService.findAll();
        return ResponseEntity.ok(orderDTOs);
    }

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping("/{id}")
    public ResponseEntity<Optional<ResponseOrderDTO>> getOrderById(@PathVariable int id) {
        Optional<ResponseOrderDTO> orderDTO = orderService.findById(id);
        return orderDTO.map(category -> new ResponseEntity<>(orderDTO, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

//    @PreAuthorize("hasRole('ROLE_MANAGER')")
//    @PutMapping("/{id}")
//    public ResponseEntity<ResponseOrderDTO> updateOrder(@PathVariable int id, @RequestBody UpdateOrderDTO orderDTO) {
//        try {
//            orderDTO.setId(id);
//            ResponseOrderDTO updatedOrder = orderService.update(id, orderDTO);
//            return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
//        } catch (RuntimeException e) {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteOrder(@PathVariable int id) {
        try {
            orderService.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping("get-order-by-status")
    public ResponseEntity<List<ResponseOrderDTO>> getOrdersByStatus(@RequestParam String status) {
        List<ResponseOrderDTO> orderDTOs = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orderDTOs);
    }

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping("get-order-details-by-orderid/{id}")
    public ResponseEntity<List<ResponseOrderDetailDTO>> getOrderDetailsByOrderId(@PathVariable int id) {
        List<ResponseOrderDetailDTO> orderDetailDTOs = orderService.getOrderDetailsByOrderId(id);
        return ResponseEntity.ok(orderDetailDTOs);
    }

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping("get-order-by-time-option")
    public ResponseEntity<List<ResponseOrderDTO>> getOrdersByTimeOption(@RequestParam int option) {
        List<ResponseOrderDTO> orderDetailDTOs = orderService.getOrdersBySelectTimeOption(option);
        return ResponseEntity.ok(orderDetailDTOs);
    }

    @GetMapping("send-store-report")
    public ResponseEntity<Object> sendStoreReport() {
        boolean check = orderService.sendReport("phamtanloc1009@gmail.com");
        if (check)
            return new ResponseEntity<>(HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}
