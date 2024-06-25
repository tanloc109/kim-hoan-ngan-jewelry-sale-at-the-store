package com.kimhoanngan.tiemvang.mappers;

import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseOrderDetailDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateOrderDetailDTO;
import com.kimhoanngan.tiemvang.pojos.Order;
import com.kimhoanngan.tiemvang.pojos.OrderDetail;
import com.kimhoanngan.tiemvang.pojos.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class OrderDetailMapper {

    @Autowired
    private ProductMapper productMapper;

    public OrderDetail toEntity(UpdateOrderDetailDTO dto, Product product, Order order) {
        OrderDetail orderDetail = new OrderDetail();
        orderDetail.setOrderDetailId(order.getId());
        orderDetail.setProduct(product);
        orderDetail.setOrder(order);
        orderDetail.setQuantity(dto.getQuantity());
        orderDetail.setPrice(dto.getPrice());
        return orderDetail;
    }

    public ResponseOrderDetailDTO toDTO(OrderDetail orderDetail) {
        ResponseOrderDetailDTO dto = new ResponseOrderDetailDTO();
        dto.setId(orderDetail.getOrderDetailId());
        dto.setQuantity(orderDetail.getQuantity());
        dto.setPrice(orderDetail.getPrice());
        dto.setProduct(productMapper.toResponseDTO(orderDetail.getProduct()));
        dto.setOrderId(orderDetail.getOrder().getId());
        return dto;
    }
}
