package com.kimhoanngan.tiemvang.mappers;

import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddStoneDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseStoneDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateStoneDTO;
import com.kimhoanngan.tiemvang.pojos.Product;
import com.kimhoanngan.tiemvang.pojos.Stone;
import org.springframework.stereotype.Component;

@Component
public class StoneMapper {

    public static Stone toEntity(AddStoneDTO dto, Product product) {
        Stone stone = new Stone();
        stone.setName(dto.getName());
        stone.setType(dto.getType());
        stone.setColor(dto.getColor());
        stone.setPrice(dto.getPrice());
        stone.setPrimary(dto.isPrimary());
        stone.setActive(dto.isActive());
        stone.setProduct(product);
        return stone;
    }

    public static Stone toEntity(UpdateStoneDTO dto, Product product) {
        Stone stone = new Stone();
        stone.setId(dto.getId());
        stone.setName(dto.getName());
        stone.setType(dto.getType());
        stone.setColor(dto.getColor());
        stone.setPrice(dto.getPrice());
        stone.setPrimary(dto.isPrimary());
        stone.setActive(dto.isActive());
        stone.setProduct(product);
        return stone;
    }

    public static ResponseStoneDTO toResponseDTO(Stone stone) {
        ResponseStoneDTO stoneDTO = new ResponseStoneDTO();
        stoneDTO.setId(stone.getId());
        stoneDTO.setProductId(stone.getProduct().getId());
        stoneDTO.setName(stone.getName());
        stoneDTO.setType(stone.getType());
        stoneDTO.setColor(stone.getColor());
        stoneDTO.setPrice(stone.getPrice());
        stoneDTO.setPrimary(stone.isPrimary());
        stoneDTO.setActive(stone.isActive());
        stoneDTO.setProductId(stone.getProduct().getId());
        return stoneDTO;
    }
}
