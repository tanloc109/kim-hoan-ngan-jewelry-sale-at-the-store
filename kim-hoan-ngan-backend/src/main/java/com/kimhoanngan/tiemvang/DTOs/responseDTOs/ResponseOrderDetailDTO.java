package com.kimhoanngan.tiemvang.DTOs.responseDTOs;

import lombok.Data;

@Data
public class ResponseOrderDetailDTO {

    private int id;

    private int quantity;

    private double price;

    private ResponseProductDTO product;

    private int orderId;
}
