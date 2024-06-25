package com.kimhoanngan.tiemvang.services.iservices;

import com.kimhoanngan.tiemvang.DTOs.ChangePasswordRequest;
import com.kimhoanngan.tiemvang.DTOs.generalsDTOs.UserDTO;
import jakarta.mail.MessagingException;

import java.util.List;

public interface IUserService extends IGeneralService<UserDTO, UserDTO, UserDTO, String>{

    List<UserDTO> findByFullNameContaining(String fullName);

    boolean checkValidEmail(String email);

    boolean forgetPassword(String email) throws MessagingException;

    boolean changePassword(ChangePasswordRequest changePasswordRequest);
}
