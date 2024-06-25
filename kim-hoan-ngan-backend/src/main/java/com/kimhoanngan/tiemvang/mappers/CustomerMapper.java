package com.kimhoanngan.tiemvang.mappers;

import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddCustomerDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseCustomerDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateCustomerDTO;
import com.kimhoanngan.tiemvang.pojos.Customer;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    public static Customer toEntity(AddCustomerDTO dto) {
        Customer customer = new Customer();
        customer.setName(dto.getName());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());
        customer.setActive(dto.isActive());
        return customer;
    }

    public static Customer toEntity(UpdateCustomerDTO dto) {
        Customer customer = new Customer();
        customer.setId(dto.getId());
        customer.setName(dto.getName());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());
        customer.setActive(dto.isActive());
        return customer;
    }

    public static ResponseCustomerDTO toResponseDTO(Customer customer) {
        ResponseCustomerDTO dto = new ResponseCustomerDTO();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setEmail(customer.getEmail());
        dto.setPhone(customer.getPhone());
        dto.setActive(customer.isActive());
        return dto;
    }
}
