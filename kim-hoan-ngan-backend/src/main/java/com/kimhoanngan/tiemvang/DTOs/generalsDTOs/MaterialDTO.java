package com.kimhoanngan.tiemvang.DTOs.generalsDTOs;

import lombok.Data;

import java.util.Date;

@Data
public class MaterialDTO {
    private String id;
    private String name;
    private double buyPrice;
    private double sellPrice;
}
