package com.kimhoanngan.tiemvang.DTOs.updateDTOs;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;

@Data
public class UpdatePaymentDTO {

    private int id;

    private String type;

    private double cash;

    private double bank;

    private double bankingCode;

    private MultipartFile bankImage;

    private int orderId;
}
