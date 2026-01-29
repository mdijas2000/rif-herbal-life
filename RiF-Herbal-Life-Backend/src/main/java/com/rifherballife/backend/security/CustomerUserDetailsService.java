package com.rifherballife.backend.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.rifherballife.backend.model.*;
import com.rifherballife.backend.repository.UserRepository;

@Service
public class CustomerUserDetailsService implements UserDetailsService{
	private final UserRepository userRepository;
	
	public CustomerUserDetailsService(UserRepository repo) {
		this.userRepository=repo;
	}
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
		User user=userRepository.findByUsername(username)
				.orElseThrow(()-> new UsernameNotFoundException("User not found"));
		return new CustomerUserDetails(user);
	}
	
}
