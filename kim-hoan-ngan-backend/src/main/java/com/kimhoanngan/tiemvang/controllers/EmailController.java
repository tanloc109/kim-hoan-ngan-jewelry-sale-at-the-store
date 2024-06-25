package com.kimhoanngan.tiemvang.controllers;

import com.kimhoanngan.tiemvang.services.servicesIMPL.EmailService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "send-email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PreAuthorize("hasRole('ROLE_STAFF')")
    @GetMapping("/send-email")
    public String sendEmail(@RequestParam String to,
                            @RequestParam String subject,
                            @RequestParam String text) throws MessagingException {
        emailService.sendHtmlEmail(to, subject, text);
        return "Email sent successfully!";
    }

}
