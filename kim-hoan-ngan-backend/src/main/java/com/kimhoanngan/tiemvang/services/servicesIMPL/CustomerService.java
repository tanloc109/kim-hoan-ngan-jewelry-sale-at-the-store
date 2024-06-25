package com.kimhoanngan.tiemvang.services.servicesIMPL;
import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddCustomerDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseCustomerDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateCustomerDTO;
import com.kimhoanngan.tiemvang.mappers.CustomerMapper;
import com.kimhoanngan.tiemvang.pojos.Customer;
import com.kimhoanngan.tiemvang.repositories.ICustomerRepository;
import com.kimhoanngan.tiemvang.services.iservices.ICustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService implements ICustomerService {

    @Autowired
    private ICustomerRepository customerRepository;


    @Override
    public List<ResponseCustomerDTO> findAll() {
        List<Customer> customers = customerRepository.findAll();
        List<ResponseCustomerDTO> customerDTOs = new ArrayList<>();
        for (Customer customer : customers) {
            customerDTOs.add(CustomerMapper.toResponseDTO(customer));
        }
        return customerDTOs;
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

    @Override
    public List<ResponseCustomerDTO> findCustomersByPhoneNumber(String phone) {
            List<Customer> customers = customerRepository.findByPhoneContaining(phone);
            List<ResponseCustomerDTO> customerDTOs = new ArrayList<>();
            for (Customer customer : customers) {
                customerDTOs.add(CustomerMapper.toResponseDTO(customer));
            }
            return customerDTOs;
        }
}
