package com.rifherballife.backend.security;

import java.beans.SimpleBeanInfo;
import java.io.IOException;
import java.util.List;

import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.*;

import jakarta.servlet.http.*;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;


public class JwtAuthFilter extends OncePerRequestFilter{

    private final JwtUtil jwtUtil;
    private final CustomerUserDetailsService userDetailsService;

    
    public JwtAuthFilter(JwtUtil jwtUtil, CustomerUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        

        // -------------------------------------------------
        // ⭐⭐ 2. NORMAL JWT VALIDATION ⭐⭐
        // -------------------------------------------------
        String token = parseJwt(request);

        if (token != null) {
            try {
                Jwts.parserBuilder()
                        .setSigningKey(jwtUtil.getJwtSecret().getBytes())
                        .build()
                        .parseClaimsJws(token);
            } catch (ExpiredJwtException e) {
                System.out.println("JWT Expired");
                filterChain.doFilter(request, response);
                return;
            } catch (Exception e) {
                System.out.println("Invalid JWT");
                filterChain.doFilter(request, response);
                return;
            }
        }

        try {
            if (token != null && jwtUtil.validateToken(token)) {
                String username = jwtUtil.getUsernameFromToken(token);
                String role = jwtUtil.getRoleFromToken(token);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                SimpleGrantedAuthority authority=new SimpleGrantedAuthority(role);
                List<SimpleGrantedAuthority> authorities=List.of(authority);
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, authorities);

                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } catch (Exception ex) {
            System.out.println("Token Validation Failed");
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}
