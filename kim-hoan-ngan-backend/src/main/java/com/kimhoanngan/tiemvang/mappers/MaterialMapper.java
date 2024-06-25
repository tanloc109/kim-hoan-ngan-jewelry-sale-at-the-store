package com.kimhoanngan.tiemvang.mappers;

import com.kimhoanngan.tiemvang.DTOs.generalsDTOs.MaterialDTO;
import com.kimhoanngan.tiemvang.pojos.Material;
import org.springframework.stereotype.Component;

@Component
public class MaterialMapper {

    public static Material toEntity(MaterialDTO materialDTO) {
        Material material = new Material();
        material.setId(materialDTO.getId());
        material.setName(materialDTO.getName());
        material.setBuyPrice(materialDTO.getBuyPrice());
        material.setSellPrice(materialDTO.getSellPrice());
        material.setActive(materialDTO.isActive());
        return material;
    }

    public static MaterialDTO toResponseDTO(Material material) {
        MaterialDTO materialDTO = new MaterialDTO();
        materialDTO.setId(material.getId());
        materialDTO.setName(material.getName());
        materialDTO.setBuyPrice(material.getBuyPrice());
        materialDTO.setSellPrice(material.getSellPrice());
        materialDTO.setActive(material.isActive());
        return materialDTO;
    }
}
