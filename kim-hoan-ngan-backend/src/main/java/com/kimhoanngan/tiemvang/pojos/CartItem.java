package com.kimhoanngan.tiemvang.pojos;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class CartItem {

    private Product product;

    private int quantity;

    public int getProductId() {
        return product.getId();
    }
}
