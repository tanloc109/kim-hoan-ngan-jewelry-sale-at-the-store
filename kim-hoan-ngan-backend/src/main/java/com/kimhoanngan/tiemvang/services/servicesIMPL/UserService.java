package com.kimhoanngan.tiemvang.services.servicesIMPL;
import com.kimhoanngan.tiemvang.DTOs.ChangePasswordRequest;
import com.kimhoanngan.tiemvang.DTOs.generalsDTOs.UserDTO;
import com.kimhoanngan.tiemvang.mappers.UserMapper;
import com.kimhoanngan.tiemvang.pojos.Role;
import com.kimhoanngan.tiemvang.pojos.User;
import com.kimhoanngan.tiemvang.repositories.IRoleRepository;
import com.kimhoanngan.tiemvang.repositories.IUserRepository;
import com.kimhoanngan.tiemvang.services.iservices.IUserService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements IUserService {

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IRoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtService jwtService;

    @Override
    public List<UserDTO> findAll() {
        List<User> users = userRepository.findAll();
        List<UserDTO> userDTOs = new ArrayList<>();
        for (User user : users) {
            userDTOs.add(UserMapper.toResponseDTO(user));
        }
        return userDTOs;
    }

    @Override
    public Optional<UserDTO> findById(String id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(UserMapper::toResponseDTO);
    }

    @Override
    public UserDTO save(UserDTO userDTO) {
        userRepository.findById(userDTO.getUsername()).ifPresent(user -> {
            throw new RuntimeException("Duplicate username");
        });
        Role role = roleRepository.findById(userDTO.getRoleId()).orElseThrow(() -> new RuntimeException("Role not found"));
        User user = UserMapper.toEntity(userDTO, role);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        userRepository.save(user);
        return UserMapper.toResponseDTO(user);
    }

    @Override
    public UserDTO update(String id, UserDTO userDTO) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        Role role = roleRepository.findById(userDTO.getRoleId()).orElseThrow(() -> new RuntimeException("Role not found"));
        User updatedUser = UserMapper.toEntity(userDTO, role);
        userRepository.save(updatedUser);
        return UserMapper.toResponseDTO(updatedUser);
    }

    @Override
    public void delete(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.deleteById(id);
    }

    @Override
    public List<UserDTO> findByFullNameContaining(String fullName) {
        List<User> users = userRepository.findByFullNameContaining(fullName);
        List<UserDTO> userDTOs = new ArrayList<>();
        for (User user : users) {
            userDTOs.add(UserMapper.toResponseDTO(user));
        }
        return userDTOs;
    }

    @Override
    public boolean checkValidEmail(String email) {
        boolean check = false;
        User user = userRepository.findByEmail(email);
        if (user != null) {
            check = true;
        }
        return check;
    }

    @Override
    public boolean forgetPassword(String email) throws MessagingException {
        boolean check = false;
        if(!checkValidEmail(email)) {
                return false;
        }
        User user = userRepository.findByEmail(email);
        if(user != null) {
            String token = jwtService.generateTokenForResetPassword(user);
            String htmlContent = "<h3>Bạn vừa yêu cầu đặt lại mật khẩu, " +
                        "để tiếp tục vui lòng <a href=\"http://localhost:3000/reset-password?token="+ token +"\">bấm vào đây</a></h3>";
            emailService.sendHtmlEmail(email, "Yêu cầu đặt lại mật khẩu", htmlContent);
            return true;
            }
        return check;
    }

    @Override
    public boolean changePassword(ChangePasswordRequest changePasswordRequest) {
        boolean check = true;
        String token = changePasswordRequest.getToken();
        if(jwtService.isTokenExpired(token)) {
            return false;
        }
        String username = jwtService.extractUsername(token);
        User user = userRepository.findByUsername(username).orElseThrow();
        if (changePasswordRequest.getNewPassword().equals(changePasswordRequest.getConfirm())) {
            user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
            userRepository.save(user);
        }
        return check;
    }
}
