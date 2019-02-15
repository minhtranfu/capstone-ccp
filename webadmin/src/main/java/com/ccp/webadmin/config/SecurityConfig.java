//package com.ccp.webadmin.config;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
//import org.springframework.security.crypto.password.PasswordEncoder;
//
//@Configuration
////@EnableWebSecurity
//public class SecurityConfig extends WebSecurityConfigurerAdapter {
//
////
//////    @Bean
//////    public BCryptPasswordEncoder passwordEncoder() {
//////        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
//////        return bCryptPasswordEncoder;
//////    }
////
////    @Override
////    protected void configure(HttpSecurity http) throws Exception {
////        http
////                .csrf().disable()
////                .authorizeRequests()
//////                .antMatchers("/img/**").permitAll()
//////                .antMatchers("/products/create").hasRole("1")
//////                .antMatchers("/", "/index", "/products/**"
//////                        , "/carts/**", "/users/**").permitAll()
////                .anyRequest().authenticated()
////                .and().formLogin().permitAll()
////                .loginProcessingUrl("/j_spring_security_check") // Submit URL
////                .loginPage("/staff/login")//
////                .defaultSuccessUrl("/home")//
////                .failureUrl("/login?error=true")//
////                .usernameParameter("username")//
////                .passwordParameter("password")
////                .and().logout().logoutSuccessUrl("/index");
////
////    }
//}
