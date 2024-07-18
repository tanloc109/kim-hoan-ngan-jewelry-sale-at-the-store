package com.kimhoanngan.tiemvang.DTOs.updateDTOs;

import lombok.Data;

@Data
public class UpdateStoneDTO {
    private int id;
    private String code;
    private String name;
    private String type;
    private String color;
    private double price;
    private boolean isPrimary;
    private int productId;
}
