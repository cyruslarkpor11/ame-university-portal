package com.example.universityeportal.config;

import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties dataSourceProperties) {
        String databaseUrl = System.getenv("DATABASE_URL");
        
        if (databaseUrl != null && !databaseUrl.isEmpty()) {
            // Railway provides DATABASE_URL in format: postgres://user:password@host:port/database
            // Spring Boot expects: jdbc:postgresql://host:port/database
            String jdbcUrl = databaseUrl.replace("postgres://", "jdbc:postgresql://");
            dataSourceProperties.setUrl(jdbcUrl);
            
            // Extract username and password from URL if needed
            // Railway sets these as separate env vars, but we'll use the URL directly
        }
        
        return dataSourceProperties.initializeDataSourceBuilder().build();
    }
}
