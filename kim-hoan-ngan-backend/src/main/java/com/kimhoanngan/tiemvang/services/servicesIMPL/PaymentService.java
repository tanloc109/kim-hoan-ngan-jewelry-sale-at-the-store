package com.kimhoanngan.tiemvang.services.servicesIMPL;
import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddPaymentDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponsePaymentDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdatePaymentDTO;
import com.kimhoanngan.tiemvang.mappers.PaymentMapper;
import com.kimhoanngan.tiemvang.pojos.Order;
import com.kimhoanngan.tiemvang.pojos.Payment;
import com.kimhoanngan.tiemvang.repositories.IOrderRepository;
import com.kimhoanngan.tiemvang.repositories.IPaymentRepository;
import com.kimhoanngan.tiemvang.services.iservices.IPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService implements IPaymentService {

    @Autowired
    private IPaymentRepository paymentRepository;

    @Autowired
    private IOrderRepository orderRepository;

    @Autowired
    private PaymentMapper paymentMapper;

    @Override
    public List<ResponsePaymentDTO> findAll() {
        List<Payment> payments = paymentRepository.findAll();
        List<ResponsePaymentDTO> paymentDTOs = new ArrayList<>();
        for (Payment payment : payments) {
            paymentDTOs.add(paymentMapper.toResponseDTO(payment));
        }
        return paymentDTOs;
    }

    @Override
    public Optional<ResponsePaymentDTO> findById(Integer id) {
        Optional<Payment> category = paymentRepository.findById(id);
        return category.map(paymentMapper::toResponseDTO);
    }

    @Override
    public ResponsePaymentDTO save(AddPaymentDTO dto) {
        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        Payment payment = paymentMapper.toEntity(dto,order);
        paymentRepository.save(payment);
        return paymentMapper.toResponseDTO(payment);
    }

    @Override
    public ResponsePaymentDTO update(Integer id, UpdatePaymentDTO dto) {
        Payment payment = paymentRepository.findById(id).orElseThrow(() -> new RuntimeException("Payment not found"));
        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        Payment updatePayment = paymentMapper.toEntity(dto, order);
        paymentRepository.save(updatePayment);
        return paymentMapper.toResponseDTO(updatePayment);
    }

    @Override
    public void delete(Integer id) {
        Payment payment = paymentRepository.findById(id).orElseThrow(() -> new RuntimeException("Payment not found"));
        paymentRepository.deleteById(id);
    }
}
