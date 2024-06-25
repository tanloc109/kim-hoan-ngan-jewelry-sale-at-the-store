package com.kimhoanngan.tiemvang.mappers;
import com.kimhoanngan.tiemvang.DTOs.generalsDTOs.RoleDTO;
import com.kimhoanngan.tiemvang.pojos.Role;
import org.springframework.stereotype.Component;

@Component
public class RoleMapper {

    public static Role toEntity(RoleDTO dto) {
        Role role = new Role();
        role.setId(dto.getId());
        role.setName(dto.getName());
        role.setActive(dto.isActive());
        return role;
    }

    public static RoleDTO toResponseDTO(Role role) {
        RoleDTO dto = new RoleDTO();
        dto.setId(role.getId());
        dto.setName(role.getName());
        dto.setActive(role.isActive());
        return dto;
    }



}
