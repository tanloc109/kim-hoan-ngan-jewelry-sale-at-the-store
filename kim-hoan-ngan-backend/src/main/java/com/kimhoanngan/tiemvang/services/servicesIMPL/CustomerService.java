package com.kimhoanngan.tiemvang.services.servicesIMPL;
import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddCustomerDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseCustomerDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateCustomerDTO;
import com.kimhoanngan.tiemvang.mappers.CustomerMapper;
import com.kimhoanngan.tiemvang.pojos.Customer;
import com.kimhoanngan.tiemvang.repositories.ICustomerRepository;
import com.kimhoanngan.tiemvang.services.iservices.ICustomerService;
import com.kimhoanngan.tiemvang.specifications.CustomerSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService implements ICustomerService {

    @Autowired
    private ICustomerRepository customerRepository;

    @Override
    public Page<ResponseCustomerDTO> findAll(Pageable pageable) {
        Page<Customer> customers = customerRepository.findAll(pageable);
        return customers.map(CustomerMapper::toResponseDTO);
    }

    @Override
    public Page<ResponseCustomerDTO> findByCriteria(List<String> fields, List<String> values, Pageable pageable) {
        Specification<Customer> spec = Specification.where(null);

        for (int i = 0; i < fields.size(); i++) {
            String field = fields.get(i);
            String value = values.get(i);
            Specification<Customer> newSpec = CustomerSpecification.filterByField(field, value);
            if (newSpec != null) {
                spec = spec.and(newSpec);
            }
        }

        Page<Customer> customers = customerRepository.findAll(spec, pageable);
        return customers.map(CustomerMapper::toResponseDTO);
    }

    @Override
    public Optional<ResponseCustomerDTO> findById(Integer id) {
        Optional<Customer> customer = customerRepository.findById(id);
        return customer.map(CustomerMapper::toResponseDTO);
    }

    @Override
    public ResponseCustomerDTO save(AddCustomerDTO customerDTO) {
        Customer customer = CustomerMapper.toEntity(customerDTO);
        customerRepository.save(customer);
        return CustomerMapper.toResponseDTO(customer);
    }

    @Override
    public ResponseCustomerDTO update(Integer id, UpdateCustomerDTO customerDTO) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new RuntimeException("Customer not found"));
        Customer updateCustomer = CustomerMapper.toEntity(customerDTO);
        customerRepository.save(updateCustomer);
        return CustomerMapper.toResponseDTO(updateCustomer);
    }

    @Override
    public void delete(Integer id) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new RuntimeException("Customer not found"));
        customerRepository.deleteById(id);
    }


}
