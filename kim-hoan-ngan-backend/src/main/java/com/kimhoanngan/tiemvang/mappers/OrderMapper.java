package com.kimhoanngan.tiemvang.mappers;
import com.kimhoanngan.tiemvang.DTOs.generalsDTOs.UserDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseOrderDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateOrderDTO;
import com.kimhoanngan.tiemvang.pojos.Customer;
import com.kimhoanngan.tiemvang.pojos.Order;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

    public static Order toEntity(UpdateOrderDTO orderDTO, Customer customer) {
        Order order = new Order();
        order.setId(orderDTO.getId());
        order.setOrderTime(orderDTO.getOrderTime());
        order.setTotalQuantity(orderDTO.getTotalQuantity());
        order.setOrderTime(orderDTO.getOrderTime());
        order.setStatus(orderDTO.getStatus());
        order.setSaleStaff(orderDTO.getSaleStaff());
        order.setCashierStaff(orderDTO.getCashierStaff());
        order.setServiceStaff(orderDTO.getServiceStaff());
        order.setCustomer(customer);
        return order;
    }

    public static ResponseOrderDTO toResponseDTO(Order order, UserDTO saleStaff, UserDTO cashierStaff, UserDTO serviceStaff) {
        ResponseOrderDTO dto = new ResponseOrderDTO();
        dto.setId(order.getId());
        dto.setCode(order.getCode());
        dto.setOrderTime(order.getOrderTime());
        dto.setTotalQuantity(order.getTotalQuantity());
        dto.setTotal(order.getTotal());
        dto.setStatus(order.getStatus());
        dto.setSaleStaff(saleStaff);
        dto.setCashierStaff(cashierStaff);
        dto.setServiceStaff(serviceStaff);
        dto.setCustomer(CustomerMapper.toResponseDTO(order.getCustomer()));
        return dto;
    }
}