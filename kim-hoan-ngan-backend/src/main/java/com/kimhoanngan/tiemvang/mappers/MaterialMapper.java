package com.kimhoanngan.tiemvang.mappers;

import com.kimhoanngan.tiemvang.DTOs.generalsDTOs.MaterialDTO;
import com.kimhoanngan.tiemvang.pojos.Material;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;

@Component
public class MaterialMapper {

    public static Material toEntity(MaterialDTO materialDTO) {
        Material material = new Material();
        material.setId(materialDTO.getId());
        material.setName(materialDTO.getName());
        material.setBuyPrice(materialDTO.getBuyPrice());
        material.setSellPrice(materialDTO.getSellPrice());
        material.setTimeUpdate(new Timestamp(System.currentTimeMillis()));
        material.setActive(true);
        return material;
    }

    public static MaterialDTO toResponseDTO(Material material) {
        MaterialDTO materialDTO = new MaterialDTO();
        materialDTO.setId(material.getId());
        materialDTO.setName(material.getName());
        materialDTO.setBuyPrice(material.getBuyPrice());
        materialDTO.setSellPrice(material.getSellPrice());
        return materialDTO;
    }
}
