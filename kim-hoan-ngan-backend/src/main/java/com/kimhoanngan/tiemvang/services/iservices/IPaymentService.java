package com.kimhoanngan.tiemvang.services.iservices;

import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddPaymentDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponsePaymentDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdatePaymentDTO;

public interface IPaymentService extends IGeneralService<ResponsePaymentDTO, AddPaymentDTO, UpdatePaymentDTO, Integer>{
}
