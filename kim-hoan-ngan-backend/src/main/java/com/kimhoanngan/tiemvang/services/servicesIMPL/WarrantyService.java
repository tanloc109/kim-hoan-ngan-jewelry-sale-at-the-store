package com.kimhoanngan.tiemvang.services.servicesIMPL;

import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddWarrantyDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseWarrantyDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateWarrantyDTO;
import com.kimhoanngan.tiemvang.mappers.WarrantyMapper;
import com.kimhoanngan.tiemvang.pojos.Customer;
import com.kimhoanngan.tiemvang.pojos.OrderDetail;
import com.kimhoanngan.tiemvang.pojos.Product;
import com.kimhoanngan.tiemvang.pojos.Warranty;
import com.kimhoanngan.tiemvang.repositories.ICustomerRepository;
import com.kimhoanngan.tiemvang.repositories.IOrderDetailRepository;
import com.kimhoanngan.tiemvang.repositories.IProductRepository;
import com.kimhoanngan.tiemvang.repositories.IWarrantyRepository;
import com.kimhoanngan.tiemvang.services.iservices.IWarrantyService;
import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class WarrantyService implements IWarrantyService {

    @Autowired
    private IWarrantyRepository warrantyRepository;


    @Autowired
    private IOrderDetailRepository orderDetailRepository;

    @Autowired
    private ICustomerRepository customerRepository;

    @Autowired
    private IProductRepository productRepository;

    @Autowired
    private WarrantyMapper warrantyMapper;


    @Override
    public List<ResponseWarrantyDTO> findAll() {
        List<Warranty> warranties = warrantyRepository.findAll();
        List<ResponseWarrantyDTO> warrantiesDTOs = new ArrayList<>();
        for (Warranty w : warranties) {
            warrantiesDTOs.add(warrantyMapper.toResponseDTO(w));
        }
        return warrantiesDTOs;
    }

    @Override
    public Optional<ResponseWarrantyDTO> findById(Integer id) {
        Optional<Warranty> warranty = warrantyRepository.findById(id);
        return warranty.map(warrantyMapper::toResponseDTO);
    }

    @Override
    public ResponseWarrantyDTO save(AddWarrantyDTO warrantyDTO) {
//        OrderDetail orderDetail = orderDetailRepository.findById(warrantyDTO.getOrderId())
//                .orElseThrow(() -> new RuntimeException("OrderDetail not found"));
//        Customer customer = customerRepository.findById(warrantyDTO.getCustomerId())
//                .orElseThrow(() -> new RuntimeException("Customer not found"));
//        Product product = productRepository.findById(warrantyDTO.getProductId())
//                .orElseThrow(() -> new RuntimeException("Product not found"));
//
//        Warranty warranty = WarrantyMapper.toEntity(warrantyDTO, orderDetail, customer, product);
//        Warranty saved = warrantyRepository.save(warranty);
//        return WarrantyMapper.toResponseDTO(saved);
        return null;
    }

    @Override
    public ResponseWarrantyDTO update(Integer id, UpdateWarrantyDTO warrantyDTO) {
        Warranty existingWarranty = warrantyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warranty not found"));
        OrderDetail orderDetail = orderDetailRepository.findById(warrantyDTO.getOrderDetailId())
                .orElseThrow(() -> new RuntimeException("OrderDetail not found"));
        Customer customer = customerRepository.findById(warrantyDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        Product product = productRepository.findById(warrantyDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Warranty updatedWarranty = warrantyMapper.toEntity(warrantyDTO, orderDetail, customer, product);
        updatedWarranty.setId(existingWarranty.getId()); // Ensure the ID remains the same

        Warranty saved = warrantyRepository.save(updatedWarranty);
        return warrantyMapper.toResponseDTO(saved);
    }

    @Override
    public void delete(Integer id) {
        Warranty existingWarranty = warrantyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warranty not found"));
        warrantyRepository.deleteById(id);
    }

    @Override
    public List<ResponseWarrantyDTO> findWarrantiesByCustomerPhone(String phone) {
        List<Warranty> warranties = warrantyRepository.findWarrantiesByCustomerPhone(phone);
        List<ResponseWarrantyDTO> warrantiesDTOs = new ArrayList<>();
        for (Warranty w : warranties) {
            warrantiesDTOs.add(warrantyMapper.toResponseDTO(w));
        }
        return warrantiesDTOs;
    }

    @Override
    public List<ResponseWarrantyDTO> findAllWarrantyOutOfDate(Date date) {
        List<Warranty> warranties = warrantyRepository.findWarrantiesOutOfDate(date);
        List<ResponseWarrantyDTO> warrantiesDTOs = new ArrayList<>();
        for (Warranty w : warranties) {
            warrantiesDTOs.add(warrantyMapper.toResponseDTO(w));
        }
        return warrantiesDTOs;
    }


}
