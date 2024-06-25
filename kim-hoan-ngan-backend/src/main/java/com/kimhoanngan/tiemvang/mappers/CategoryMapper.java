package com.kimhoanngan.tiemvang.mappers;
import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddCategoryDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseCategoryDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateCategoryDTO;
import com.kimhoanngan.tiemvang.pojos.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public static Category toEntity(AddCategoryDTO dto) {
        Category category = new Category();
        category.setName(dto.getName());
        category.setActive(dto.isActive());
        return category;
    }

    public static Category toEntity(UpdateCategoryDTO dto) {
        Category category = new Category();
        category.setId(dto.getId());
        category.setName(dto.getName());
        category.setActive(dto.isActive());
        return category;
    }

    public static ResponseCategoryDTO toResponseDTO(Category category) {
        ResponseCategoryDTO dto = new ResponseCategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setActive(category.isActive());
        return dto;
    }

}
