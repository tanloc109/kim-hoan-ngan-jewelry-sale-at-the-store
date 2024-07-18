package com.kimhoanngan.tiemvang.DTOs.responseDTOs;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class ResponsePaymentDTO {
    private int id;
    private String code;
    private String type;
    private double cash;
    private double bank;
    private double bankingCode;
    private Timestamp paymentTime;
    private String bankImage;
    private int orderId;
}
