package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.AdminAccountEntity;
import com.ccp.webadmin.services.AdminAccountService;
import com.ccp.webadmin.utils.PasswordAutoGenerator;
import com.ccp.webadmin.utils.SendEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.validation.Valid;
import java.io.IOException;

@Controller
public class LoginController {

    private final AdminAccountService adminAccountService;

    @Autowired
    public LoginController(AdminAccountService adminAccountService) {
        this.adminAccountService = adminAccountService;
    }

    @GetMapping({"", "/", "/login"})
    public String login(Model model) {
//        if (error != null) {
//            return "/error/403";
//        }
        return "/login";
    }

    @GetMapping("/access-denied")
    public String accessDenied(Model model) {
        return "/error/403";
    }

    @GetMapping("/forgetPassword")
    public String create(Model model) {
        model.addAttribute("email", "");
        return "staff/create";
    }

//    @PostMapping("/saveProcess")
//    public String saveProcess(
//            @Valid @ModelAttribute("email") String email,
//            BindingResult bindingResult, Model model) {
//
//
//
//        adminAccountService.save(adminAccountEntity);
//        Integer id = adminAccountEntity.getId();
//        return "redirect:detail/" + id;
//    }
}
