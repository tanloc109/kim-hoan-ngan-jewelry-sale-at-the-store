package com.kimhoanngan.tiemvang.services.servicesIMPL;

import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseOrderDetailDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateOrderDetailDTO;
import com.kimhoanngan.tiemvang.mappers.OrderDetailMapper;
import com.kimhoanngan.tiemvang.pojos.Order;
import com.kimhoanngan.tiemvang.pojos.OrderDetail;
import com.kimhoanngan.tiemvang.pojos.Product;
import com.kimhoanngan.tiemvang.repositories.IOrderDetailRepository;
import com.kimhoanngan.tiemvang.repositories.IOrderRepository;
import com.kimhoanngan.tiemvang.repositories.IProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderDetailService{

    @Autowired
    private IOrderDetailRepository orderDetailRepository;

    @Autowired
    private IOrderRepository orderRepository;

    @Autowired
    private IProductRepository productRepository;

    @Autowired
    private OrderDetailMapper orderDetailMapper;

    public List<ResponseOrderDetailDTO> findAll() {
        List<OrderDetail> orderDetails = orderDetailRepository.findAll();
        return orderDetails.stream()
                .map(orderDetailMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<ResponseOrderDetailDTO> findById(int id) {
        Optional<OrderDetail> orderDetail = orderDetailRepository.findById(id);
        return orderDetail.map(orderDetailMapper::toDTO);
    }

    public ResponseOrderDetailDTO update(int id, UpdateOrderDetailDTO orderDetailDTO) {
        OrderDetail existingOrderDetail = orderDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderDetail not found"));

        Order order = orderRepository.findById(orderDetailDTO.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Product product = productRepository.findById(orderDetailDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        existingOrderDetail.setOrder(order);
        existingOrderDetail.setProduct(product);
        existingOrderDetail.setQuantity(orderDetailDTO.getQuantity());
        existingOrderDetail.setPrice(orderDetailDTO.getPrice());

        OrderDetail savedOrderDetail = orderDetailRepository.save(existingOrderDetail);

        return orderDetailMapper.toDTO(savedOrderDetail);
    }

    public void delete(int id) {
        OrderDetail orderDetail = orderDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderDetail not found"));
        orderDetailRepository.delete(orderDetail);
    }
}
