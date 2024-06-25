package com.kimhoanngan.tiemvang.pojos;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Data
@RequiredArgsConstructor
public class Cart {

    private Map<Integer, CartItem> items = new HashMap<>();

    public Map<Integer, CartItem> getItems() {
        return items;
    }

    public void addItem(CartItem item) {
        items.put(item.getProductId(), item);
    }

    public void removeItem(int productId) {
        items.remove(productId);
    }

    public void clear() {
        items.clear();
    }
}
