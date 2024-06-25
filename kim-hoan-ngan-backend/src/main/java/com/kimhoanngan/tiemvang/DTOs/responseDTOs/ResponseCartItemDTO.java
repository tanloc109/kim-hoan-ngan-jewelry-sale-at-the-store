package com.kimhoanngan.tiemvang.DTOs.responseDTOs;

import com.kimhoanngan.tiemvang.pojos.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class ResponseCartItemDTO {

    private ResponseProductDTO product;

    private int quantity;

}
