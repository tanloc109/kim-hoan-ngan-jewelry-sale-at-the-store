package com.kimhoanngan.tiemvang.services.servicesIMPL;
import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddStoneDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseStoneDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateStoneDTO;
import com.kimhoanngan.tiemvang.mappers.StoneMapper;
import com.kimhoanngan.tiemvang.pojos.Product;
import com.kimhoanngan.tiemvang.pojos.Stone;
import com.kimhoanngan.tiemvang.repositories.IProductRepository;
import com.kimhoanngan.tiemvang.repositories.IStoneRepository;
import com.kimhoanngan.tiemvang.services.iservices.IStoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class StoneService implements IStoneService {

    @Autowired
    private IStoneRepository stoneRepository;

    @Autowired
    private IProductRepository productRepository;

    @Override
    public List<ResponseStoneDTO> findAll() {
        List<Stone> stones = stoneRepository.findAll();
        List<ResponseStoneDTO> stonesDTOs = new ArrayList<>();
        for (Stone stone : stones) {
            stonesDTOs.add(StoneMapper.toResponseDTO(stone));
        }
        return stonesDTOs;
    }

    @Override
    public Optional<ResponseStoneDTO> findById(Integer id) {
        Optional<Stone> stone = stoneRepository.findById(id);
        return stone.map(StoneMapper::toResponseDTO);
    }

    @Override
    public ResponseStoneDTO save(AddStoneDTO stoneDTO) {
        Product product = productRepository.findById(stoneDTO.getProductId()).orElseThrow(() -> new RuntimeException("Product not found"));
        Stone stone = StoneMapper.toEntity(stoneDTO, product);
        Stone saved = stoneRepository.save(stone);
        reCalculateTotalPriceStones(stoneDTO.getProductId());
        return StoneMapper.toResponseDTO(saved);
    }

    @Override
    public ResponseStoneDTO update(Integer id, UpdateStoneDTO stoneDTO) {
        Stone stone = stoneRepository.findById(id).orElseThrow(() -> new RuntimeException("Stone not found"));
        Product product = productRepository.findById(stoneDTO.getProductId()).orElseThrow(() -> new RuntimeException("Product not found"));
        Stone updated = StoneMapper.toEntity(stoneDTO, product);
        stoneRepository.save(updated);
        reCalculateTotalPriceStones(stoneDTO.getProductId());
        return StoneMapper.toResponseDTO(updated);
    }

    @Override
    public void delete(Integer id) {
        Stone stone = stoneRepository.findById(id).orElseThrow(() -> new RuntimeException("Stone not found"));
        stoneRepository.deleteById(id);
        Product product = productRepository.findById(stone.getProduct().getId()).orElseThrow(() -> new RuntimeException("Product not found"));
        reCalculateTotalPriceStones(product.getId());
    }

    public void reCalculateTotalPriceStones(int productId) {
        List<Stone> stones = stoneRepository.findStonesByProductId(productId);
        double total = 0;
        for (Stone stone : stones) {
            total += stone.getPrice();
        }
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
        product.setPriceStone(total);
        product.setPrice(product.getGoldWeight() * product.getMaterial().getSellPrice() + product.getWage() + total);
        productRepository.save(product);
    }

    @Override
    public List<ResponseStoneDTO> findStonesByName(String name) {
        List<Stone> stones = stoneRepository.findByNameContaining(name);
        List<ResponseStoneDTO> stonesDTOs = new ArrayList<>();
        for (Stone stone : stones) {
            stonesDTOs.add(StoneMapper.toResponseDTO(stone));
        }
        return stonesDTOs;
    }
}
