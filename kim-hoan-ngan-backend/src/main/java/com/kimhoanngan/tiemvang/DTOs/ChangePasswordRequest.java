package com.kimhoanngan.tiemvang.DTOs;

import lombok.Data;

@Data
public class ChangePasswordRequest {

    private String token;

    private String newPassword;

    private String confirm;

}
