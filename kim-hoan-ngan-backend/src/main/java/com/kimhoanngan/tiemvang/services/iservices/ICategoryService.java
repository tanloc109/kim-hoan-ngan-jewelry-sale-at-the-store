package com.kimhoanngan.tiemvang.services.iservices;

import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddCategoryDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseCategoryDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateCategoryDTO;
import com.kimhoanngan.tiemvang.pojos.Category;

import java.util.List;

public interface ICategoryService extends IGeneralService<ResponseCategoryDTO, AddCategoryDTO, UpdateCategoryDTO, Integer>{

    List<ResponseCategoryDTO> findCategoiesByName(String name);
}
