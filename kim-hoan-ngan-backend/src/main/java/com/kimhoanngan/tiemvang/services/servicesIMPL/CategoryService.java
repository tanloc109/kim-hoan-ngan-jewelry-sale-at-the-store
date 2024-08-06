    package com.kimhoanngan.tiemvang.services.servicesIMPL;

    import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddCategoryDTO;
    import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseCategoryDTO;
    import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateCategoryDTO;
    import com.kimhoanngan.tiemvang.mappers.CategoryMapper;
    import com.kimhoanngan.tiemvang.pojos.Category;
    import com.kimhoanngan.tiemvang.repositories.ICategoryRepository;
    import com.kimhoanngan.tiemvang.services.iservices.ICategoryService;
    import com.kimhoanngan.tiemvang.specifications.CategorySpecification;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.data.domain.Page;
    import org.springframework.data.domain.Pageable;
    import org.springframework.data.jpa.domain.Specification;
    import org.springframework.stereotype.Service;

    import java.util.List;
    import java.util.Optional;

    @Service
    public class CategoryService implements ICategoryService {

        @Autowired
        private ICategoryRepository categoryRepository;

        @Override
        public Page<ResponseCategoryDTO> findAll(Pageable pageable) {
            Page<Category> categories = categoryRepository.findAll(pageable);
            return categories.map(CategoryMapper::toResponseDTO);
        }

        @Override
        public Page<ResponseCategoryDTO> findByCriteria(List<String> fields, List<String> values, Pageable pageable) {
            Specification<Category> spec = Specification.where(null);

            for (int i = 0; i < fields.size(); i++) {
                String field = fields.get(i);
                String value = values.get(i);
                Specification<Category> newSpec = CategorySpecification.filterByField(field, value);
                if (newSpec != null) {
                    spec = spec.and(newSpec);
                }
            }

            Page<Category> categories = categoryRepository.findAll(spec, pageable);
            return categories.map(CategoryMapper::toResponseDTO);
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
            Category updatedCategory = CategoryMapper.toEntity(categoryDTO);
            categoryRepository.save(updatedCategory);
            return CategoryMapper.toResponseDTO(updatedCategory);
        }

        @Override
        public void delete(Integer id) {
            Category category = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
            categoryRepository.deleteById(id);
        }
    }
