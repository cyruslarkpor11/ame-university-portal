package com.example.universityeportal;

import com.example.universityeportal.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private static final String LOGIN_PATH = "/login";
    private static final String[] PUBLIC_MATCHERS = {
        "/h2-console/**",
        "/error",
        "/actuator/**",
        LOGIN_PATH,
        "/forgot-password",
        "/forgot-password.html",
        "/change-password",
        "/",
        "/Images/**",
        "/images/**",
        "/manifest.json",
        "/offline.html",
        "/offline-login.html",
        "/offline-admin.html",
        "/offline-lecturer.html",
        "/offline-student.html",
        "/service-worker.js",
        "/admin-dashboard.html",
        "/admin-dashboard.js",
        "/api/users/login",
        "/api/users",
        "/api/departments/**",
        "/api/announcements/**",
        "/api/calendar/**",
        "/request-access.html"
    };

    private final UserRepository userRepository;

    public SecurityConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByUsername(username)
                .map(user -> User.builder()
                        .username(user.getUsername())
                        .password(user.getPassword())
                        .roles(user.getRole().name())
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                .requestMatchers(PUBLIC_MATCHERS).permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/lecturer/**").hasAnyRole("LECTURER", "ADMIN")
                .requestMatchers("/api/student/**").hasAnyRole("STUDENT", "ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage(LOGIN_PATH)
                .loginProcessingUrl(LOGIN_PATH)
                .usernameParameter("username")
                .passwordParameter("password")
                .failureUrl(LOGIN_PATH + "?error")
                .defaultSuccessUrl("/", true)
                .permitAll()
            )
            .logout(logout -> logout
                .logoutSuccessUrl(LOGIN_PATH)
                .permitAll()
            )
            .sessionManagement(session -> session
                .sessionConcurrency(concurrency -> concurrency
                    .maximumSessions(1)
                )
                .invalidSessionUrl(LOGIN_PATH)
                .sessionFixation().migrateSession()
            )
            .httpBasic(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }
}
