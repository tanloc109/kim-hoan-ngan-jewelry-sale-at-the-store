package com.kimhoanngan.tiemvang.services.iservices;

import com.kimhoanngan.tiemvang.DTOs.generalsDTOs.MaterialDTO;

import java.util.List;

public interface IMaterialService extends IGeneralService<MaterialDTO, MaterialDTO, MaterialDTO, String> {

    List<MaterialDTO> findMaterialsByName(String name);

}
