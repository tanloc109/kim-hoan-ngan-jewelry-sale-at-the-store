package com.kimhoanngan.tiemvang.services.iservices;

import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddCustomerDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseCustomerDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateCustomerDTO;

import java.util.List;

public interface ICustomerService extends IGeneralService<ResponseCustomerDTO, AddCustomerDTO, UpdateCustomerDTO, Integer> {

    List<ResponseCustomerDTO> findCustomersByPhoneNumber(String phone);
}
