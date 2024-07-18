package com.kimhoanngan.tiemvang.DTOs.addDTOs;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class AddPaymentDTO {
    private String type;
    private double cash;
    private double bank;
    private double bankingCode;
    private MultipartFile bankImage;
    private int orderId;
}
