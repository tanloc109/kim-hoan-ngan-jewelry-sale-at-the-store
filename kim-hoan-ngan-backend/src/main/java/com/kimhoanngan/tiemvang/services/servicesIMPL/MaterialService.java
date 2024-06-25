package com.kimhoanngan.tiemvang.services.servicesIMPL;

import com.kimhoanngan.tiemvang.DTOs.generalsDTOs.MaterialDTO;
import com.kimhoanngan.tiemvang.mappers.MaterialMapper;
import com.kimhoanngan.tiemvang.pojos.Material;
import com.kimhoanngan.tiemvang.repositories.IMaterialRepository;
import com.kimhoanngan.tiemvang.services.iservices.IMaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MaterialService implements IMaterialService {

    @Autowired
    private IMaterialRepository materialRepository;


    @Override
    public List<MaterialDTO> findAll() {
        List<Material> materials = materialRepository.findAll();
        List<MaterialDTO> materialDTOs = new ArrayList<>();
        for (Material material : materials) {
            materialDTOs.add(MaterialMapper.toResponseDTO(material));
        }
        return materialDTOs;
    }

    @Override
    public Optional<MaterialDTO> findById(String id) {
        Optional<Material> material = materialRepository.findById(id);
        return material.map(MaterialMapper::toResponseDTO);
    }

    @Override
    public MaterialDTO save(MaterialDTO materialDTO) {
        materialRepository.findById(materialDTO.getId()).ifPresent(material -> {
            throw new RuntimeException("Duplicate Material");
        });
        Material material = MaterialMapper.toEntity(materialDTO);
        materialRepository.save(material);
        return MaterialMapper.toResponseDTO(material);
    }

    @Override
    public MaterialDTO update(String id, MaterialDTO materialDTO) {
        Material material = materialRepository.findById(id).orElseThrow(() -> new RuntimeException("Material not found"));
        Material updateMaterial = MaterialMapper.toEntity(materialDTO);
        materialRepository.save(updateMaterial);
        return MaterialMapper.toResponseDTO(updateMaterial);
    }

    @Override
    public void delete(String id) {
        Material material = materialRepository.findById(id).orElseThrow(() -> new RuntimeException("Material not found"));
        materialRepository.delete(material);
    }

    @Override
    public List<MaterialDTO> findMaterialsByName(String name) {
        List<Material> materials = materialRepository.findByNameContaining(name);
        List<MaterialDTO> materialDTOs = new ArrayList<>();
        for (Material material : materials) {
            materialDTOs.add(MaterialMapper.toResponseDTO(material));
        }
        return materialDTOs;
    }
}
