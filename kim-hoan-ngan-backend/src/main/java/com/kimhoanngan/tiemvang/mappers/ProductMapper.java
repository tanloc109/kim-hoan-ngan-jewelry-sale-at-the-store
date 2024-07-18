package com.kimhoanngan.tiemvang.mappers;

import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddProductDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseProductDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateProductDTO;
import com.kimhoanngan.tiemvang.pojos.Category;
import com.kimhoanngan.tiemvang.pojos.Material;
import com.kimhoanngan.tiemvang.pojos.Product;
import com.kimhoanngan.tiemvang.repositories.IProductRepository;
import com.kimhoanngan.tiemvang.services.servicesIMPL.ImageUploadingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    private final ImageUploadingService imageUploadingService;

    @Autowired
    private IProductRepository productRepository;

    @Autowired
    public ProductMapper(ImageUploadingService imageUploadingService) {
        this.imageUploadingService = imageUploadingService;
    }

    public Product toEntity(AddProductDTO dto, Category category, Material material) {
        Product product = new Product();
        product.setCode(dto.getCode());
        product.setName(dto.getName());
        product.setGoldWeight(dto.getGoldWeight());
        product.setQuantity(dto.getQuantity());
        product.setPrice(dto.getPrice());
        product.setSize(dto.getSize());
        product.setNumOfWarranty(dto.getNumOfWarranty());
        product.setWage(dto.getWage());
        product.setCategory(category);
        product.setMaterial(material);
        product.setActive(true);
        return product;
    }

    public Product toEntity(UpdateProductDTO dto, Category category, Material material) {
        Product product = new Product();
        product.setId(dto.getId());
        product.setCode(dto.getCode());
        product.setName(dto.getName());
        product.setGoldWeight(dto.getGoldWeight());
        product.setQuantity(dto.getQuantity());
        product.setPrice(dto.getPrice());
        product.setSize(dto.getSize());
        product.setNumOfWarranty(dto.getNumOfWarranty());
        product.setWage(dto.getWage());
        product.setCategory(category);
        product.setMaterial(material);
        product.setActive(true);
        return product;
    }

    public ResponseProductDTO toResponseDTO(Product product) {
        ResponseProductDTO dto = new ResponseProductDTO();
        dto.setId(product.getId());
        dto.setCode(product.getCode());
        dto.setName(product.getName());
        dto.setImage(product.getImage());
        dto.setGoldWeight(product.getGoldWeight());
        dto.setQuantity(product.getQuantity());
        dto.setPrice(product.getPrice());
        dto.setSize(product.getSize());
        dto.setNumOfWarranty(product.getNumOfWarranty());
        dto.setWage(product.getWage());
        dto.setPriceStone(product.getPriceStone());
        dto.setStones(product.getStones().stream()
                .map(StoneMapper::toResponseDTO)
                .collect(Collectors.toList()));
        dto.setCategory(CategoryMapper.toResponseDTO(product.getCategory()));
        dto.setMaterial(MaterialMapper.toResponseDTO(product.getMaterial()));
        return dto;
    }

    public Product saveProductWithImage(AddProductDTO dto, Category category, Material material) throws IOException {
        Product product = toEntity(dto, category, material);
        product = productRepository.save(product);
        String imageUrl = imageUploadingService.uploadProduct(dto.getImage());
        return productRepository.save(product);
    }
}
