package com.kimhoanngan.tiemvang.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("Kim Hoan Ngan Jewelry Sale System At The Store"))
                .addSecurityItem(new SecurityRequirement().addList("Kim Hoan Ngan Authentication Service"))
                .components(new Components().addSecuritySchemes("Kim Hoan Ngan Authentication Service", new SecurityScheme()
                .name("Kim Hoan Ngan Authentication Service").type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));
    }
}