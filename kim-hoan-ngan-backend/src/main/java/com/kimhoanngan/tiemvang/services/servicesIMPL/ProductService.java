package com.kimhoanngan.tiemvang.services.servicesIMPL;
import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddProductDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseProductDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateProductDTO;
import com.kimhoanngan.tiemvang.mappers.ProductMapper;
import com.kimhoanngan.tiemvang.pojos.Category;
import com.kimhoanngan.tiemvang.pojos.Material;
import com.kimhoanngan.tiemvang.pojos.Product;
import com.kimhoanngan.tiemvang.pojos.Stone;
import com.kimhoanngan.tiemvang.repositories.ICategoryRepository;
import com.kimhoanngan.tiemvang.repositories.IMaterialRepository;
import com.kimhoanngan.tiemvang.repositories.IProductRepository;
import com.kimhoanngan.tiemvang.services.iservices.ICategoryService;
import com.kimhoanngan.tiemvang.services.iservices.IProductService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService implements IProductService {

    @Autowired
    private IProductRepository productRepository;

    @Autowired
    private ICategoryRepository categoryRepository;

    @Autowired
    private IMaterialRepository materialRepository;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private ImageUploadingService imageUploadingService;

    @Override
    public List<ResponseProductDTO> findAll() {
        List<Product> products = productRepository.findAll();
        List<ResponseProductDTO> productDTOs = new ArrayList<>();
        for (Product product : products) {
            productDTOs.add(productMapper.toResponseDTO(product));
        }
        return productDTOs;
    }

    @Override
    public Optional<ResponseProductDTO> findById(Integer id) {
        Optional<Product> product = productRepository.findById(id);
        return product.map(productMapper::toResponseDTO);
    }

    @Override
    public ResponseProductDTO save(AddProductDTO productDTO) throws IOException {
        Category category = categoryRepository.findById(productDTO.getCategoryId()).orElseThrow(() -> new RuntimeException("Category not found"));
        Material material = materialRepository.findById(productDTO.getMaterialId()).orElseThrow(() -> new RuntimeException("Material not found"));
        Product product = productMapper.toEntity(productDTO, category, material);
        productRepository.save(product);
        return productMapper.toResponseDTO(product);
    }

    @Override
    @Transactional
    public ResponseProductDTO update(Integer id, UpdateProductDTO productDTO) throws IOException {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        Material material = materialRepository.findById(productDTO.getMaterialId())
                .orElseThrow(() -> new RuntimeException("Material not found"));

        product.setName(productDTO.getName());
        if (productDTO.getImage() != null) {
            String imageUrl = imageUploadingService.uploadProduct(productDTO.getImage());
            product.setImage(imageUrl);
        }
        product.setGoldWeight(productDTO.getGoldWeight());
        product.setQuantity(productDTO.getQuantity());
        product.setPrice(productDTO.getPrice());
        product.setSize(productDTO.getSize());
        product.setNumOfWarranty(productDTO.getNumOfWarranty());
        product.setWage(productDTO.getWage());
        product.setActive(productDTO.isActive());
        product.setCategory(category);
        product.setMaterial(material);
        try {
            productRepository.save(product);
        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to update product");
        }
        return productMapper.toResponseDTO(product);
    }

    @Override
    public void delete(Integer id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        productRepository.delete(product);
    }


    @Override
    public List<ResponseProductDTO> findAllProductsOutOfStock() {
        List<Product> products = productRepository.getProductOutOfStock();
        List<ResponseProductDTO> productDTOs = new ArrayList<>();
        for (Product product : products) {
            productDTOs.add(productMapper.toResponseDTO(product));
        }
        return productDTOs;
    }

    @Override
    public List<ResponseProductDTO> getTop10ProductsBestSeller() {
        List<Product> products = productRepository.getTopBestSeller();
        List<ResponseProductDTO> productDTOs = new ArrayList<>();
        for (Product product : products) {
            productDTOs.add(productMapper.toResponseDTO(product));
        }
        return productDTOs;
    }

    @Override
    public ResponseProductDTO updatePriceFollowPriceMaterial(int productId) {
        return calculateProductPriceFollowMaterialPrice(productId);
    }

    @Override
    public List<ResponseProductDTO> updateAllPriceFollowPriceMaterial() {
        List<Product> products = productRepository.findAll();
        List<ResponseProductDTO> productDTOs = new ArrayList<>();
        for (Product product : products) {
            productDTOs.add(calculateProductPriceFollowMaterialPrice(product.getId()));
        }
        return productDTOs;
    }

    @Override
    public List<ResponseProductDTO> getProductsBySearchKey(String searchKey) {
        List<Product> products = productRepository.findProductBySearch(searchKey);
        List<ResponseProductDTO> productDTOs = new ArrayList<>();
        for (Product product : products) {
            productDTOs.add(productMapper.toResponseDTO(product));
        }
        return productDTOs;
    }


    private ResponseProductDTO calculateProductPriceFollowMaterialPrice(int productId) {
        double total = 0;
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
        List<Stone> stones = product.getStones();
        for (Stone stone : stones) {
            total += stone.getPrice();
        }
        double wage = product.getWage();
        Material material = product.getMaterial();
        double goldPrice = material.getSellPrice() * product.getGoldWeight();
        product.setPrice(total + wage + goldPrice);
        productRepository.save(product);
        ResponseProductDTO responseProductDTO = productMapper.toResponseDTO(product);
        return responseProductDTO;
    }
}
