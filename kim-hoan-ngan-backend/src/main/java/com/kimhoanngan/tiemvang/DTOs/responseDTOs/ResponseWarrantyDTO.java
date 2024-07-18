package com.kimhoanngan.tiemvang.DTOs.responseDTOs;

import lombok.Data;

import java.util.Date;

@Data
public class ResponseWarrantyDTO {
    private int id;
    private String code;
    private Date startDate;
    private Date endDate;
    private int orderDetailId;
    private ResponseCustomerDTO customer;
    private ResponseProductDTO product;
}
