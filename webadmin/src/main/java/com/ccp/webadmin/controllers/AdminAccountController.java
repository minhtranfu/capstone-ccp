package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.AdminUserEntity;
import com.ccp.webadmin.repositories.AdminAccountRepository;
import com.ccp.webadmin.services.AdminAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("staff")
public class AdminAccountController {

    private final AdminAccountService adminAccountService;

    @Autowired
    public AdminAccountController(AdminAccountService adminAccountService) {
        this.adminAccountService = adminAccountService;
    }

    @GetMapping({"", "/", "/index"})
    public String getStaff(Model model) {
        model.addAttribute("staffs", adminAccountService.findAll());
        return "staff/index";
    }

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("staff", adminAccountService.findStaffById(id));
        return "staff/index";
    }

//    @GetMapping("create")
//    public String showAddPersonPage(Model model) {
//
//        StaffEntity staff = new StaffEntity();
//        model.addAttribute("staff", staff);
//        return "staff/create";
//    }
//
//    @PostMapping("create")
//    public String savePerson(Model model,
//                             @ModelAttribute("staffForm") StaffEntity staff) {
//
//        String firstName = staff.get();
//        String lastName = staff.getLastName();
//
//        if (firstName != null && firstName.length() > 0 //
//                && lastName != null && lastName.length() > 0) {
//            StaffEntity newPerson = new StaffEntity(firstName, lastName);
//            persons.add(newPerson);
//
//            return "redirect:/personList";
//        }
//
//        model.addAttribute("errorMessage", errorMessage);
//        return "addPerson";
//    }
}
