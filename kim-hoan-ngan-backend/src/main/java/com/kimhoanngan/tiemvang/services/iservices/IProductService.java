package com.kimhoanngan.tiemvang.services.iservices;

import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddProductDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseProductDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateProductDTO;

import java.util.List;

public interface IProductService extends IGeneralService<ResponseProductDTO, AddProductDTO, UpdateProductDTO, Integer> {

    List<ResponseProductDTO> findAllProductsOutOfStock();

    List<ResponseProductDTO> getTop10ProductsBestSeller();

    ResponseProductDTO updatePriceFollowPriceMaterial(int productId);

    List<ResponseProductDTO> updateAllPriceFollowPriceMaterial();

    List<ResponseProductDTO> getProductsBySearchKey(String searchKey);
}
