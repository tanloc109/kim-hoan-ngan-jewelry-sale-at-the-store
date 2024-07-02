package com.kimhoanngan.tiemvang.services.iservices;

import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddProductDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseProductDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateProductDTO;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface IProductService {

    Page<ResponseProductDTO> findAll(Pageable pageable);

    Page<ResponseProductDTO> findByCriteria(List<String> fields, List<String> values, Pageable pageable);

    Optional<ResponseProductDTO> findById(Integer id);

    ResponseProductDTO save(AddProductDTO productDTO) throws IOException;

    @Transactional
    ResponseProductDTO update(Integer id, UpdateProductDTO productDTO) throws IOException;

    void delete(Integer id);

    List<ResponseProductDTO> getTop10ProductsBestSeller();

    ResponseProductDTO updatePriceFollowPriceMaterial(int productId);

    List<ResponseProductDTO> updateAllPriceFollowPriceMaterial();
}
