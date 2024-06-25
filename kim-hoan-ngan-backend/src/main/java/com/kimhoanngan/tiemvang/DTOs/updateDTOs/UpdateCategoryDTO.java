package com.kimhoanngan.tiemvang.DTOs.updateDTOs;

import lombok.Data;

@Data
public class UpdateCategoryDTO {

    private int id;

    private String name;

    private boolean isActive;
}
