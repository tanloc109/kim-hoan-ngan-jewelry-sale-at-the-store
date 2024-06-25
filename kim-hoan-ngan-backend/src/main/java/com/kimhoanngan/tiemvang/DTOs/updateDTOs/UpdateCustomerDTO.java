package com.kimhoanngan.tiemvang.DTOs.updateDTOs;
import lombok.Data;

@Data
public class UpdateCustomerDTO {

    private int id;

    private String name;

    private String phone;

    private String email;

    private boolean isActive;
}
