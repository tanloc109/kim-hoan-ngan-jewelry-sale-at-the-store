    package com.kimhoanngan.tiemvang.services.servicesIMPL;
    import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddCategoryDTO;
    import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseCategoryDTO;
    import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateCategoryDTO;
    import com.kimhoanngan.tiemvang.mappers.CategoryMapper;
    import com.kimhoanngan.tiemvang.pojos.Category;
    import com.kimhoanngan.tiemvang.repositories.ICategoryRepository;
    import com.kimhoanngan.tiemvang.services.iservices.ICategoryService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;

    import java.util.ArrayList;
    import java.util.List;
    import java.util.Optional;

    @Service
    public class CategoryService implements ICategoryService {

        @Autowired
        private ICategoryRepository categoryRepository;


        @Override
        public List<ResponseCategoryDTO> findAll() {
            List<Category> categories = categoryRepository.findAll();
            List<ResponseCategoryDTO> categoriesDTO = new ArrayList<>();
            for (Category category : categories) {
                categoriesDTO.add(CategoryMapper.toResponseDTO(category));
            }
            return categoriesDTO;
        }

        @Override
        public Optional<ResponseCategoryDTO> findById(Integer id) {
            Optional<Category> category = categoryRepository.findById(id);
            return category.map(CategoryMapper::toResponseDTO);
        }

        @Override
        public ResponseCategoryDTO save(AddCategoryDTO categoryDTO) {
            Category category = CategoryMapper.toEntity(categoryDTO);
            categoryRepository.save(category);
            return CategoryMapper.toResponseDTO(category);
        }

        @Override
        public ResponseCategoryDTO update(Integer id, UpdateCategoryDTO categoryDTO) {
            Category category = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
            category.setName(categoryDTO.getName());
            category.setActive(categoryDTO.isActive());
            categoryRepository.save(category);
            return CategoryMapper.toResponseDTO(category);
        }

        @Override
        public void delete(Integer id) {
            Category category = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
            categoryRepository.deleteById(id);
        }

        @Override
        public List<ResponseCategoryDTO> findCategoiesByName(String name) {
            List<Category> categories = categoryRepository.findByNameContaining(name);
            List<ResponseCategoryDTO> categoriesDTO = new ArrayList<>();
            for (Category category : categories) {
                categoriesDTO.add(CategoryMapper.toResponseDTO(category));
            }
            return categoriesDTO;
        }
    }
