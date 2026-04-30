package com.example.universityeportal;

import com.example.universityeportal.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
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
        "/",
        "/Images/**",
        "/images/**",
        "/manifest.json",
        "/offline.html",
        "/offline-login.html",
        "/offline-admin.html",
        "/offline-lecturer.html",
        "/offline-student.html",
        "/service-worker.js"
    };

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // In-memory users for demo (matching offline portal credentials)
    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails admin = User.builder()
            .username("admin")
            .password(passwordEncoder().encode("admin123"))
            .roles("ADMIN")
            .build();
        
        UserDetails lecturer = User.builder()
            .username("lecturer")
            .password(passwordEncoder().encode("lecturer123"))
            .roles("LECTURER")
            .build();
        
        UserDetails student = User.builder()
            .username("student")
            .password(passwordEncoder().encode("student123"))
            .roles("STUDENT")
            .build();
        
        return new InMemoryUserDetailsManager(admin, lecturer, student);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                .requestMatchers(PUBLIC_MATCHERS).permitAll()
                .requestMatchers("/api/admin/**", "/portal/admin").hasRole("ADMIN")
                .requestMatchers("/api/lecturer/**", "/portal/lecturer").hasRole("LECTURER")
                .requestMatchers("/api/student/**", "/portal/student").hasRole("STUDENT")
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
