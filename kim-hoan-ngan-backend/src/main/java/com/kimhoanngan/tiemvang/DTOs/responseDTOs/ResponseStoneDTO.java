package com.kimhoanngan.tiemvang.DTOs.responseDTOs;

import lombok.Data;

@Data
public class ResponseStoneDTO {

    private int id;

    private String name;

    private String type;

    private String color;

    private double price;

    private boolean isPrimary;

    private boolean isActive;

    private int productId;
}
