package com.ccp.webadmin.controllers;

import com.ccp.webadmin.dtos.LineChartStatisticDTO;
import com.ccp.webadmin.dtos.PieChartStatisticDTO;
import com.ccp.webadmin.dtos.StaffDTO;
import com.ccp.webadmin.dtos.StatisticHiringTransactionDTO;
import com.ccp.webadmin.entities.AdminAccountEntity;
import com.ccp.webadmin.services.*;
import com.ccp.webadmin.utils.ImageUtil;
import com.ccp.webadmin.utils.PasswordAutoGenerator;
import com.ccp.webadmin.utils.SendEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.MessagingException;
import javax.validation.Valid;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("home")
public class HomeController {

    private final AdminAccountService adminAccountService;
    private final ContractorService contractorService;
    private final ReportService reportService;
    private final PasswordAutoGenerator passwordAutoGenerator;
    private final SendEmailService sendEmailService;

    @Autowired
    public HomeController(AdminAccountService adminAccountService, ContractorService contractorService, ReportService reportService, PasswordAutoGenerator passwordAutoGenerator, SendEmailService sendEmailService) {
        this.adminAccountService = adminAccountService;
        this.contractorService = contractorService;
        this.reportService = reportService;
        this.passwordAutoGenerator = passwordAutoGenerator;
        this.sendEmailService = sendEmailService;
    }

    @GetMapping({"", "/", "index"})
    public String home(Model model) {
        model.addAttribute("newContractor", contractorService.countNewContractor());
        model.addAttribute("newFeedback", reportService.countNewReport());
        return "home/index";
    }

    @GetMapping("/userdetail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("staff", adminAccountService.findById(id));
        return "home/userdetail";
    }

    @GetMapping("/changePassword/{id}")
    public String changePassword(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("staff", new StaffDTO(id));
        return "home/changePassword";
    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("staff") AdminAccountEntity adminAccountEntity,
            BindingResult bindingResult,
            @RequestParam("file") MultipartFile file,
            Model model) {
        if (bindingResult.hasErrors()) {
            if (adminAccountEntity.getId() != null) {
                AdminAccountEntity foundAdminAccount = adminAccountService.findById(adminAccountEntity.getId());
                adminAccountEntity.setUsername(foundAdminAccount.getUsername());
                adminAccountEntity.getAdminUserEntity().setRole(foundAdminAccount.getAdminUserEntity().getRole());
                return "home/userdetail";
            }
        }
        String imageUrl = updateImageFile(file);
        //update staff account
        AdminAccountEntity foundAdminAccount = adminAccountService.findById(adminAccountEntity.getId());
        // validate existed username or email
        if (!adminAccountEntity.getAdminUserEntity().getEmail().equals(foundAdminAccount.getAdminUserEntity().getEmail())) {
            if ( adminAccountService.existsByEmail(adminAccountEntity.getAdminUserEntity().getEmail())) {

                model.addAttribute("errorMessageEmail", "Exitsted Email");
                return "home/userdetail";
            }
        }
        if (!file.isEmpty()) {
            foundAdminAccount.getAdminUserEntity().setThumbnail(imageUrl);
        }
        foundAdminAccount.getAdminUserEntity().setName(adminAccountEntity.getAdminUserEntity().getName());
        foundAdminAccount.getAdminUserEntity().setMale(adminAccountEntity.getAdminUserEntity().isMale());
        foundAdminAccount.getAdminUserEntity().setPhone(adminAccountEntity.getAdminUserEntity().getPhone());
        foundAdminAccount.getAdminUserEntity().setEmail(adminAccountEntity.getAdminUserEntity().getEmail());
        adminAccountService.save(foundAdminAccount);
        Integer id = adminAccountEntity.getId();
        return "redirect:userdetail/" + id;
    }

    @PostMapping("/savePassword")
    public String savePassword(
            @Valid @ModelAttribute("staff") StaffDTO staffDTO,
            Model model) {
        AdminAccountEntity adminAccountEntity = adminAccountService.findById(staffDTO.getId());
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(11);
        //check password
        if (!BCrypt.checkpw(staffDTO.getPassword(), adminAccountEntity.getPassword())) {
            model.addAttribute("errorMessage", "Old Password is not correct");
            return "home/changePassword";
        } else {
            if (BCrypt.checkpw(staffDTO.getNewPassword(), adminAccountEntity.getPassword())) {
                model.addAttribute("errorMessage", "New password mustnot be same old password");
                return "home/changePassword";
            }
        }
        String encodedNewPassword = passwordEncoder.encode(staffDTO.getNewPassword());
        adminAccountEntity.setPassword(encodedNewPassword);
        adminAccountService.save(adminAccountEntity);
        Integer id = adminAccountEntity.getId();
        return "redirect:userdetail/" + id;
    }

    private String updateImageFile(MultipartFile file) {
        String credentialPath = this.getClass().getClassLoader().getResource("capstone-ccp-credential.json").getPath();
        String url = "";
        try {
            url = ImageUtil.uploadFile(credentialPath, file.getInputStream(), file.getOriginalFilename());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return url;
    }

}
