package com.ccp.webadmin.controllers;

import com.ccp.webadmin.dtos.StaffDTO;
import com.ccp.webadmin.entities.AdminAccountEntity;
import com.ccp.webadmin.entities.AdminUserEntity;
import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.repositories.AdminAccountRepository;
import com.ccp.webadmin.services.AdminAccountService;
import com.ccp.webadmin.services.RoleService;
import com.ccp.webadmin.utils.ImageUtil;
import com.ccp.webadmin.utils.PasswordAutoGenerator;
import com.ccp.webadmin.utils.SendEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.security.RolesAllowed;
import javax.mail.MessagingException;
import javax.validation.Valid;
import java.io.IOException;

@Controller
@RequestMapping("staff")
public class AdminAccountController {

    private final AdminAccountService adminAccountService;
    private final RoleService roleService;
    private final PasswordAutoGenerator passwordAutoGenerator;
    private final SendEmailService sendEmailService;

    @Autowired
    public AdminAccountController(AdminAccountService adminAccountService, RoleService roleService, PasswordAutoGenerator passwordAutoGenerator, SendEmailService sendEmailService) {
        this.adminAccountService = adminAccountService;
        this.roleService = roleService;
        this.passwordAutoGenerator = passwordAutoGenerator;
        this.sendEmailService = sendEmailService;
    }

    @GetMapping({"", "/", "/index"})
    public String getStaff(Model model) {
        model.addAttribute("staffs", adminAccountService.findAll());
        return "staff/index";
    }

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("staff", adminAccountService.findById(id));
        model.addAttribute("roles", roleService.findAll());
        return "staff/detail";
    }

    @GetMapping("/changePassword/{id}")
    public String changePassword(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("staff", new StaffDTO(id));
        return "staff/changePassword";
    }

    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("staff", new AdminAccountEntity());
        model.addAttribute("roles", roleService.findAll());
        return "staff/create";
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
                model.addAttribute("roles", roleService.findAll());
                return "staff/detail";
            } else
                model.addAttribute("roles", roleService.findAll());
                return "staff/create";
        }
        String imageUrl = updateImageFile(file);

        //update staff account
        if (adminAccountEntity.getId() != null) {
            AdminAccountEntity foundAdminAccount = adminAccountService.findById(adminAccountEntity.getId());

            // validate existed username or email
            if (!adminAccountEntity.getAdminUserEntity().getEmail().equals(foundAdminAccount.getAdminUserEntity().getEmail())) {
                if (adminAccountService.existsByEmail(adminAccountEntity.getAdminUserEntity().getEmail())) {
                    model.addAttribute("errorMessageEmail", "Exitsted Email");
                    model.addAttribute("roles", roleService.findAll());
                    return "staff/detail";
                }
            }
            if(!file.isEmpty()){
                foundAdminAccount.getAdminUserEntity().setThumbnail(imageUrl);
            }
            foundAdminAccount.getAdminUserEntity().setName(adminAccountEntity.getAdminUserEntity().getName());
            foundAdminAccount.getAdminUserEntity().setMale(adminAccountEntity.getAdminUserEntity().isMale());
            foundAdminAccount.getAdminUserEntity().setPhone(adminAccountEntity.getAdminUserEntity().getPhone());
            foundAdminAccount.getAdminUserEntity().setEmail(adminAccountEntity.getAdminUserEntity().getEmail());
            foundAdminAccount.getAdminUserEntity().setRole(adminAccountEntity.getAdminUserEntity().getRole());
            adminAccountService.save(foundAdminAccount);
            //create staff account
        } else {
            // validate existed username or email
            if (adminAccountService.existsByUsername(adminAccountEntity.getUsername()) || adminAccountService.existsByEmail(adminAccountEntity.getAdminUserEntity().getEmail())) {
                model.addAttribute("errorMessage", "Exitsted Username");
                model.addAttribute("errorMessageEmail", "Exitsted Email");
                model.addAttribute("roles", roleService.findAll());
                return "staff/create";
            }

            //generate random password and encodedpassword
            PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(11);
            String password = passwordAutoGenerator.generatePassayPassword();
            String encodedPassword = passwordEncoder.encode(password);

            // send email
            try {
                sendEmailService.sendmail(adminAccountEntity.getUsername(), password, adminAccountEntity.getAdminUserEntity().getEmail());
            } catch (MessagingException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
            adminAccountEntity.getAdminUserEntity().setThumbnail(imageUrl);
            adminAccountEntity.setPassword(encodedPassword);
            adminAccountService.save(adminAccountEntity);
        }
        model.addAttribute("roles", roleService.findAll());
        Integer id = adminAccountEntity.getId();
        return "redirect:detail/" + id;
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
            return "staff/changePassword";
        } else {
            if (BCrypt.checkpw(staffDTO.getNewPassword(), adminAccountEntity.getPassword())) {
                model.addAttribute("errorMessage", "New password mustnot be same old password");
                return "staff/changePassword";
            }
        }
        String encodedNewPassword = passwordEncoder.encode(staffDTO.getNewPassword());
        adminAccountEntity.setPassword(encodedNewPassword);
        adminAccountService.save(adminAccountEntity);
        Integer id = adminAccountEntity.getId();
        return "redirect:detail/" + id;
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
