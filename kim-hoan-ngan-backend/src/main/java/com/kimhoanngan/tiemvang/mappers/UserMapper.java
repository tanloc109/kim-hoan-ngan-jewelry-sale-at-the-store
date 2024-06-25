package com.kimhoanngan.tiemvang.mappers;

import com.kimhoanngan.tiemvang.DTOs.generalsDTOs.UserDTO;
import com.kimhoanngan.tiemvang.pojos.Role;
import com.kimhoanngan.tiemvang.pojos.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public static User toEntity(UserDTO dto, Role role) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword());
        user.setFullName(dto.getFullName());
        user.setAddress(dto.getAddress());
        user.setPhone(dto.getPhone());
        user.setEmail(dto.getEmail());
        user.setDob(dto.getDob());
        user.setLevel(dto.getLevel());
        user.setActive(dto.isActive());
        user.setRole(role);
       return user;
    }

    public static UserDTO toResponseDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setUsername(user.getUsername());
        dto.setPassword(user.getPassword());
        dto.setFullName(user.getFullName());
        dto.setAddress(user.getAddress());
        dto.setPhone(user.getPhone());
        dto.setEmail(user.getEmail());
        dto.setDob(user.getDob());
        dto.setLevel(user.getLevel());
        dto.setActive(user.isActive());
        dto.setRoleId(user.getRole().getId());
        return dto;
    }
}
