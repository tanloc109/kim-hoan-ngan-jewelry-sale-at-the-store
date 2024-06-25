package com.kimhoanngan.tiemvang.DTOs.generalsDTOs;

import lombok.Data;

@Data
public class MaterialDTO {

    private String id;

    private String name;

    private double buyPrice;

    private double sellPrice;

    private boolean isActive;
}
