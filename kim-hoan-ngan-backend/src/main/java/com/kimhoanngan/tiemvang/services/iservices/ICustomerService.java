package com.kimhoanngan.tiemvang.services.iservices;

import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddCustomerDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseCustomerDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateCustomerDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ICustomerService {
    Page<ResponseCustomerDTO> findAll(Pageable pageable);
    Page<ResponseCustomerDTO> findByCriteria(List<String> fields, List<String> values, Pageable pageable);
    Optional<ResponseCustomerDTO> findById(Integer id);
    ResponseCustomerDTO save(AddCustomerDTO customerDTO);
    ResponseCustomerDTO update(Integer id, UpdateCustomerDTO customerDTO);
    void delete(Integer id);
}
