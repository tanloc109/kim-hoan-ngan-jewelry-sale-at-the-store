package com.kimhoanngan.tiemvang.DTOs.addDTOs;
import lombok.Data;

@Data
public class AddCustomerDTO {

    private String name;

    private String phone;

    private String email;

    private boolean isActive;
}
