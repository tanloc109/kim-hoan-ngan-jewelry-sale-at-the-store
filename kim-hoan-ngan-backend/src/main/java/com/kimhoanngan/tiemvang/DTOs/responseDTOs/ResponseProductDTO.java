    package com.kimhoanngan.tiemvang.DTOs.responseDTOs;

    import com.kimhoanngan.tiemvang.DTOs.generalsDTOs.MaterialDTO;
    import lombok.Data;

    import java.util.List;

    @Data
    public class ResponseProductDTO {

        private int id;

        private String name;

        private String image;

        private float goldWeight;

        private int quantity;

        private double price;

        private String size;

        private int numOfWarranty;

        private double wage;

        private double priceStone;

        private boolean isActive;

        private ResponseCategoryDTO category;

        private MaterialDTO material;

        private List<ResponseStoneDTO> stones;
    }
