package com.kimhoanngan.tiemvang.DTOs.updateDTOs;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class UpdateOrderDTO {
    private int id;
    private Timestamp orderTime;
    private int totalQuantity;
    private double total;
    private String status;
    private String saleStaff;
    private String cashierStaff;
    private String serviceStaff;
    private int customerId;
}
