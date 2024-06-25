package com.kimhoanngan.tiemvang.DTOs.generalsDTOs;

import lombok.Data;

import java.util.Date;

@Data
public class UserDTO {

    private String username;

    private String fullName;

    private String password;

    private String address;

    private String phone;

    private String email;

    private Date dob;

    private int level;

    private String roleId;

    private boolean isActive;
}
