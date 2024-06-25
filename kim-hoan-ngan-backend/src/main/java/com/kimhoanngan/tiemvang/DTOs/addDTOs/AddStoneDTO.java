package com.kimhoanngan.tiemvang.DTOs.addDTOs;

import lombok.Data;

@Data
public class AddStoneDTO {

    private String name;

    private String type;

    private String color;

    private double price;

    private boolean isPrimary;

    private boolean isActive;

    private int productId;
}
