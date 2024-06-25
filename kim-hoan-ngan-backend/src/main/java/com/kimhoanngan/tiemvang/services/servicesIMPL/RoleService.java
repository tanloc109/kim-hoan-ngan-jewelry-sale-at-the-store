package com.kimhoanngan.tiemvang.services.servicesIMPL;

import com.kimhoanngan.tiemvang.DTOs.generalsDTOs.RoleDTO;
import com.kimhoanngan.tiemvang.mappers.RoleMapper;
import com.kimhoanngan.tiemvang.pojos.Role;
import com.kimhoanngan.tiemvang.repositories.IRoleRepository;
import com.kimhoanngan.tiemvang.services.iservices.IRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RoleService implements IRoleService {

    @Autowired
    private IRoleRepository roleRepository;

    @Override
    public List<RoleDTO> findAll() {
        List<Role> roles = roleRepository.findActiveRoles();
        List<RoleDTO> roleDTOs = new ArrayList<RoleDTO>();
        for (Role role : roles) {
            roleDTOs.add(RoleMapper.toResponseDTO(role));
        }
        return roleDTOs;
    }

    @Override
    public Optional<RoleDTO> findById(String id) {
        Optional<Role> roleOptional = roleRepository.findById(id);
        return roleOptional.map(RoleMapper::toResponseDTO);
    }

    @Override
    public RoleDTO save(RoleDTO roleDTO) {
        roleRepository.findById(roleDTO.getId()).ifPresent(role -> {
            throw new RuntimeException("Duplicate ID found");
        });
        Role role = RoleMapper.toEntity(roleDTO);
        roleRepository.save(role);
        return RoleMapper.toResponseDTO(role);
    }

    @Override
    public RoleDTO update(String id, RoleDTO roleDTO) {
        Role role = roleRepository.findById(id).orElseThrow(() -> new RuntimeException("Role not found"));
        Role updateRole = RoleMapper.toEntity(roleDTO);
        roleRepository.save(updateRole);
        return RoleMapper.toResponseDTO(updateRole);
    }

    @Override
    public void delete(String id) {
        Role role = roleRepository.findById(id).orElseThrow(() -> new RuntimeException("Role not found"));
        roleRepository.deleteById(id);
    }
}
