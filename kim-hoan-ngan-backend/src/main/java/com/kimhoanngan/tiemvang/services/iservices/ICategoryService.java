package com.kimhoanngan.tiemvang.services.iservices;

import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddCategoryDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseCategoryDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateCategoryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface ICategoryService {
    Page<ResponseCategoryDTO> findAll(Pageable pageable);
    Page<ResponseCategoryDTO> findByCriteria(List<String> fields, List<String> values, Pageable pageable);
    Optional<ResponseCategoryDTO> findById(Integer id);
    ResponseCategoryDTO save(AddCategoryDTO categoryDTO);
    ResponseCategoryDTO update(Integer id, UpdateCategoryDTO categoryDTO);
    void delete(Integer id);
}
