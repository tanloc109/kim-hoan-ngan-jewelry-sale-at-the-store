package com.kimhoanngan.tiemvang.mappers;
import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddWarrantyDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseWarrantyDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateWarrantyDTO;
import com.kimhoanngan.tiemvang.pojos.Customer;
import com.kimhoanngan.tiemvang.pojos.OrderDetail;
import com.kimhoanngan.tiemvang.pojos.Product;
import com.kimhoanngan.tiemvang.pojos.Warranty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class WarrantyMapper {

    @Autowired
    private ProductMapper productMapper;

    public Warranty toEntity(AddWarrantyDTO dto, OrderDetail orderDetail, Customer customer, Product product) {
        Warranty warranty = new Warranty();
        warranty.setOrderDetail(orderDetail);
        warranty.setCustomer(customer);
        warranty.setProduct(product);
        return warranty;
    }

    public Warranty toEntity(UpdateWarrantyDTO dto, OrderDetail orderDetail, Customer customer, Product product) {
        Warranty warranty = new Warranty();
        warranty.setId(dto.getId());
        warranty.setStartDate(dto.getStartDate());
        warranty.setEndDate(dto.getEndDate());
        warranty.setOrderDetail(orderDetail);
        warranty.setCustomer(customer);
        warranty.setProduct(product);
        return warranty;
    }

    public ResponseWarrantyDTO toResponseDTO(Warranty warranty) {
        ResponseWarrantyDTO dto = new ResponseWarrantyDTO();
        dto.setId(warranty.getId());
        dto.setCode(warranty.getCode());
        dto.setStartDate(warranty.getStartDate());
        dto.setEndDate(warranty.getEndDate());
        dto.setOrderDetailId(warranty.getOrderDetail().getOrderDetailId());
        dto.setCustomer(CustomerMapper.toResponseDTO(warranty.getCustomer()));
        dto.setProduct(productMapper.toResponseDTO(warranty.getProduct()));
        return dto;
    }
}
