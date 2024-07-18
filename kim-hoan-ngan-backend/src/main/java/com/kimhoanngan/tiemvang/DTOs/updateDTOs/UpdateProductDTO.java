package com.kimhoanngan.tiemvang.DTOs.updateDTOs;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UpdateProductDTO {
    private int id;
    private String code;
    private String name;
    private MultipartFile image;
    private float goldWeight;
    private int quantity;
    private double price;
    private String size;
    private int numOfWarranty;
    private double wage;
    private int categoryId;
    private String materialId;
}
