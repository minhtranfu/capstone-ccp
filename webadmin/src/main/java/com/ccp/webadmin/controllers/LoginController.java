package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.AdminAccountEntity;
import com.ccp.webadmin.services.AdminAccountService;
import com.ccp.webadmin.utils.PasswordAutoGenerator;
import com.ccp.webadmin.utils.SendEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import java.io.IOException;

@Controller
public class LoginController {

    private final AdminAccountService adminAccountService;
    private final PasswordAutoGenerator passwordAutoGenerator;
    private final SendEmailService sendEmailService;

    @Autowired
    public LoginController(AdminAccountService adminAccountService, PasswordAutoGenerator passwordAutoGenerator, SendEmailService sendEmailService) {
        this.adminAccountService = adminAccountService;
        this.passwordAutoGenerator = passwordAutoGenerator;
        this.sendEmailService = sendEmailService;
    }

    @GetMapping({"", "/", "/login"})
    public String login(Model model) {
        return "/login";
    }

    @GetMapping("/access-denied")
    public String accessDenied(Model model) {
        return "/error/403";
    }

    @GetMapping("/forgotPassword")
    public String create(Model model) {
        return "forgotPassword";
    }

    @GetMapping("/resetPassword")
    public String resetPassword(@RequestParam(value = "email") String email,
            Model model) {
        if (!adminAccountService.existsByEmail(email)) {
            model.addAttribute("errorMessage", "Email doesnot exist");
            AdminAccountEntity adminAccountEntity = adminAccountService.findByEmail(email);
            return "forgotPassword";
        }
        AdminAccountEntity adminAccountEntity = adminAccountService.findByEmail(email);

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(11);
        String password = passwordAutoGenerator.generatePassayPassword();
        String encodedPassword = passwordEncoder.encode(password);

        adminAccountEntity.setPassword(encodedPassword);
        adminAccountService.save(adminAccountEntity);
        try {
            sendEmailService.sendmail(adminAccountEntity.getUsername(), password, adminAccountEntity.getAdminUserEntity().getEmail());
        } catch (MessagingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "redirect:login";
    }

}
