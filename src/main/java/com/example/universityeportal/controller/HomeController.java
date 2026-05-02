package com.example.universityeportal.controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/login")
    public String login() {
        return "unified-login";
    }

    @GetMapping("/forgot-password")
    public String forgotPassword() {
        return "forgot-password";
    }

    @GetMapping("/change-password")
    public String changePassword() {
        return "change-password";
    }

    @GetMapping("/")
    public String home(Authentication authentication, Model model) {
        if (authentication == null || !authentication.isAuthenticated()) {
            // Show landing page first (online portal prioritized)
            return "redirect:/index.html";
        }

        String username = authentication.getName();
        model.addAttribute("username", username);

        // Redirect based on role
        for (var auth : authentication.getAuthorities()) {
            String authority = auth.getAuthority();
            if (authority.equals("ROLE_ADMIN")) {
                model.addAttribute("role", "ADMIN");
                return "redirect:/admin-dashboard.html";
            } else if (authority.equals("ROLE_LECTURER")) {
                model.addAttribute("role", "LECTURER");
                return "redirect:/lecturer-dashboard.html";
            } else if (authority.equals("ROLE_STUDENT")) {
                model.addAttribute("role", "STUDENT");
                return "redirect:/student-dashboard.html";
            }
        }

        return "home";
    }

    @GetMapping("/portal/student")
    public String studentPortal(Authentication authentication, Model model) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return "redirect:/login";
        }
        model.addAttribute("username", authentication.getName());
        return "student-portal";
    }

    @GetMapping("/portal/lecturer")
    public String lecturerPortal(Authentication authentication, Model model) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return "redirect:/login";
        }
        model.addAttribute("username", authentication.getName());
        return "lecturer-portal";
    }

    @GetMapping("/portal/admin")
    public String adminPortal(Authentication authentication, Model model) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return "redirect:/login";
        }
        model.addAttribute("username", authentication.getName());
        return "admin-portal";
    }
}
