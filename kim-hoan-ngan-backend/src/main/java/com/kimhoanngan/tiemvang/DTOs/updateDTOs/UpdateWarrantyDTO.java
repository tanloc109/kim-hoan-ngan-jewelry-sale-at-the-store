package com.kimhoanngan.tiemvang.DTOs.updateDTOs;

import lombok.Data;

import java.util.Date;

@Data
public class UpdateWarrantyDTO {
    private int id;
    private Date startDate;
    private Date endDate;
    private int orderDetailId;
    private int customerId;
    private int productId;
}
