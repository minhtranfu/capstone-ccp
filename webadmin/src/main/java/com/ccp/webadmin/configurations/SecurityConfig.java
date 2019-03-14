package com.ccp.webadmin.configurations;

import com.ccp.webadmin.services.AdminAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final PasswordEncoder passwordEncoder;
    private final AdminAccountService adminAccountService;

    @Autowired
    public SecurityConfig(PasswordEncoder passwordEncoder, AdminAccountService adminAccountService) {
        this.passwordEncoder = passwordEncoder;
        this.adminAccountService = adminAccountService;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(adminAccountService).passwordEncoder(passwordEncoder);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        //login, logout config
        http.
                authorizeRequests()
                .antMatchers("/static/**","/vendor/**","/dist/**","/data/**","/images/**").permitAll()
                .antMatchers("/login").permitAll()
//                .antMatchers("/staff/**").permitAll()
                .antMatchers("/staff/**").hasAuthority("ROLE_ADMIN").anyRequest()
                .authenticated().and().csrf().disable().formLogin()
                .loginPage("/login").failureUrl("/login?error=true")
                .defaultSuccessUrl("/home")
                .usernameParameter("username")
                .passwordParameter("password")
                .and().logout()
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .logoutSuccessUrl("/login?logout").and().exceptionHandling()
                .accessDeniedPage("/access-denied");
    }

}
