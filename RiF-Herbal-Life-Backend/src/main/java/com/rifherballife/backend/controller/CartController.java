package com.rifherballife.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rifherballife.backend.model.CartItem;
import com.rifherballife.backend.service.CartService;

import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/cart")

public class CartController {
	@Autowired
	private CartService cartService;

	@GetMapping
	public List<CartItem> getCart(Authentication authentication) {
		return cartService.getCart(authentication.getName());
	}

	@PostMapping("/add")
	public void addToCart(@RequestBody CartItem item, Authentication authentication) {
		cartService.addToCart(item, authentication.getName());
	}

	@PutMapping("/increase/{productId}")
	public void increaseQty(@PathVariable Long productId, Authentication authentication) {
		cartService.increase(productId, authentication.getName());
	}

	@PutMapping("/decrease/{productId}")
	public void decreaseQty(@PathVariable Long productId, Authentication authentication) {
		cartService.decrease(productId, authentication.getName());
	}

	@DeleteMapping("/{productId}")
	public void deleteItem(@PathVariable Long productId, Authentication authentication) {
		cartService.delete(productId, authentication.getName());
	}

	@DeleteMapping("/clear")
	public void clearCart(Authentication authentication) {
		cartService.clear(authentication.getName());
	}
}
