package com.kimhoanngan.tiemvang.services.iservices;

import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddWarrantyDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseWarrantyDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateWarrantyDTO;

import java.util.Date;
import java.util.List;

public interface IWarrantyService extends IGeneralService<ResponseWarrantyDTO, AddWarrantyDTO, UpdateWarrantyDTO, Integer> {

    List<ResponseWarrantyDTO> findWarrantiesByCustomerPhone(String phone);

    List<ResponseWarrantyDTO> findAllWarrantyOutOfDate(Date date);

}
