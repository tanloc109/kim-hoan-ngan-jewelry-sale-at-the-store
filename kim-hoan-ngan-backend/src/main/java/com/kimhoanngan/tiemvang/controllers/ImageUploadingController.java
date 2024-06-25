package com.kimhoanngan.tiemvang.controllers;

import com.kimhoanngan.tiemvang.services.servicesIMPL.ImageUploadingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("images")
@RequiredArgsConstructor
public class ImageUploadingController {

    private final ImageUploadingService imageService;

    @PostMapping
    public String upload(@RequestParam("file") MultipartFile multipartFile) {
        return imageService.uploadProduct(multipartFile);
    }
}
