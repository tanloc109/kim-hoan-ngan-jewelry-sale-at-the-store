package com.kimhoanngan.tiemvang.controllers;

import com.kimhoanngan.tiemvang.DTOs.AuthenticationRequest;
import com.kimhoanngan.tiemvang.DTOs.ChangePasswordRequest;
import com.kimhoanngan.tiemvang.DTOs.ForgetPasswordRequest;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.AuthenticationResponse;
import com.kimhoanngan.tiemvang.services.servicesIMPL.AuthenticationService;
import com.kimhoanngan.tiemvang.services.servicesIMPL.UserService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    private final UserService userService;

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @PostMapping("/forget-password")
    public ResponseEntity<String> forgetPassword(@RequestBody ForgetPasswordRequest request) throws MessagingException {
        boolean result = userService.forgetPassword(request.getEmail());
        if (result) {
            return new ResponseEntity<>("Email sent", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Email not found", HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        if (!changePasswordRequest.getNewPassword().equals(changePasswordRequest.getConfirm())) {
            return new ResponseEntity<>("Password and confirm is not match", HttpStatus.BAD_REQUEST);
        }
        boolean check = userService.changePassword(changePasswordRequest);
        if (check) {
            return new ResponseEntity<>("Password changed, please login", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Something error", HttpStatus.NO_CONTENT);
        }
    }

}
