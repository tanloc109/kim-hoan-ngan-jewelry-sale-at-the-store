package com.kimhoanngan.tiemvang.DTOs.updateDTOs;

import lombok.Data;

@Data
public class UpdateOrderDetailDTO {

    private int id;

    private int productId;

    private int quantity;

    private double price;

    private int orderId;
}
