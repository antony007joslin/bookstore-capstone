package com.bookstore.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI bookstoreOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("E-Commerce Bookstore REST API")
                        .description("Cloud FullStack Capstone Project REST API Documentation for E-Bookstore platform")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Capstone Developer")
                                .email("developer@bookstore.com"))
                        .license(new License().name("Apache 2.0").url("https://springdoc.org")));
    }
}
