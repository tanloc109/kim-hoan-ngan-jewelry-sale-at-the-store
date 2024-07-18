package com.kimhoanngan.tiemvang.DTOs.addDTOs;

import lombok.Data;

@Data
public class AddStoneDTO {
    private String code;
    private String name;
    private String type;
    private String color;
    private double price;
    private boolean isPrimary;
    private int productId;
}
