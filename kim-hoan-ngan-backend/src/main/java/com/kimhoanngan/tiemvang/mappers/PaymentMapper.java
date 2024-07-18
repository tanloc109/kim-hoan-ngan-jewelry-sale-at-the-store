package com.kimhoanngan.tiemvang.mappers;

import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddPaymentDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponsePaymentDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdatePaymentDTO;
import com.kimhoanngan.tiemvang.pojos.Order;
import com.kimhoanngan.tiemvang.pojos.Payment;
import com.kimhoanngan.tiemvang.services.servicesIMPL.ImageUploadingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;

@Component
public class PaymentMapper {

    private final ImageUploadingService imageUploadingService;

    @Autowired
    public PaymentMapper(ImageUploadingService imageUploadingService) {
        this.imageUploadingService = imageUploadingService;
    }

    public Payment toEntity(AddPaymentDTO dto, Order order) {
        Payment payment = new Payment();
        payment.setType(dto.getType());
        payment.setCash(dto.getCash());
        payment.setBank(dto.getBank());
        payment.setBankingCode(dto.getBankingCode());
        String imageUrl = imageUploadingService.uploadPayment(dto.getBankImage());
        payment.setBankImage(imageUrl);
        payment.setOrder(order);
        payment.setPaymentTime(new Timestamp(System.currentTimeMillis()));
        return payment;
    }

    public Payment toEntity(UpdatePaymentDTO dto, Order order) {
        Payment payment = new Payment();
        payment.setId(dto.getId());
        payment.setType(dto.getType());
        payment.setCash(dto.getCash());
        payment.setBank(dto.getBank());
        payment.setBankingCode(dto.getBankingCode());
        String imageUrl = imageUploadingService.uploadPayment(dto.getBankImage());
        payment.setBankImage(imageUrl);
        payment.setOrder(order);
        return payment;
    }

    public ResponsePaymentDTO toResponseDTO(Payment payment) {
        ResponsePaymentDTO dto = new ResponsePaymentDTO();
        dto.setId(payment.getId());
        dto.setCode(payment.getCode());
        dto.setType(payment.getType());
        dto.setCash(payment.getCash());
        dto.setBank(payment.getBank());
        dto.setBankingCode(payment.getBankingCode());
        dto.setBankImage(payment.getBankImage());
        dto.setOrderId(payment.getOrder().getId());
        dto.setPaymentTime(payment.getPaymentTime());
        return dto;
    }
}
