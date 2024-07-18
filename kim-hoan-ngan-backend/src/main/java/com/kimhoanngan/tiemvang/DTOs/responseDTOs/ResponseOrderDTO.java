package com.kimhoanngan.tiemvang.DTOs.responseDTOs;

import com.kimhoanngan.tiemvang.DTOs.generalsDTOs.UserDTO;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class ResponseOrderDTO {
    private int id;
    private String code;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private Timestamp orderTime;
    private int totalQuantity;
    private double total;
    private String status;
    private UserDTO saleStaff;
    private UserDTO cashierStaff;
    private UserDTO serviceStaff;
    private ResponseCustomerDTO customer;
}
