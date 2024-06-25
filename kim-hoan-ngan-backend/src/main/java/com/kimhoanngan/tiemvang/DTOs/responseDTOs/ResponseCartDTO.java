package com.kimhoanngan.tiemvang.DTOs.responseDTOs;

import com.kimhoanngan.tiemvang.pojos.Product;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class ResponseCartDTO {

    private List<ResponseCartItemDTO> items;

    public ResponseCartDTO(List<ResponseCartItemDTO> items) {
        this.items = items;
    }
}
