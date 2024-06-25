package com.kimhoanngan.tiemvang.services.iservices;

import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddStoneDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseStoneDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateStoneDTO;

import java.util.List;

public interface IStoneService extends IGeneralService<ResponseStoneDTO, AddStoneDTO, UpdateStoneDTO, Integer> {

    List<ResponseStoneDTO> findStonesByName(String name);

}
