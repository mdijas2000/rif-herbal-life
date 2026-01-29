package com.rifherballife.backend.service;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rifherballife.backend.model.*;
import com.rifherballife.backend.model.CartItem;
import com.rifherballife.backend.repository.CartItemRepository;
import com.rifherballife.backend.repository.ProductRepository;

@Service
public class CartService {

	@Autowired
	private CartItemRepository repo;

	@Autowired
	private ProductRepository productRepo;

	public List<CartItem> getCart(String username) {
		return repo.findByUsername(username);
	}

	public void addToCart(CartItem item, String username) {

		Product product = productRepo.findById(item.getProductId()).orElse(null);
		if (product == null)
			return;

		Optional<CartItem> existingOpt = repo.findByUsernameAndProductId(username, item.getProductId());
		if (existingOpt.isPresent()) {
			CartItem existing = existingOpt.get();
			if (product.getStock() != null && existing.getQuantity() + 1 > product.getStock()) {
				throw new RuntimeException("Cannot add more items. Stock limit reached.");
			}
			existing.setQuantity(existing.getQuantity() + 1);
			repo.save(existing);
		} else {
			if (product.getStock() != null && 1 > product.getStock()) {
				throw new RuntimeException("Product is out of stock.");
			}
			CartItem newItem = new CartItem();
			newItem.setProductId(item.getProductId());
			newItem.setQuantity(1);
			newItem.setProductName(product.getProductName());
			newItem.setPrice(product.getPrice());
			newItem.setImageURL(product.getImageURL());
			newItem.setUsername(username);

			repo.save(newItem);

		}
	}

	public void increase(Long productId, String username) {
		Optional<CartItem> itOpt = repo.findByUsernameAndProductId(username, productId);
		if (itOpt.isPresent()) {
			CartItem it = itOpt.get();
			Product product = productRepo.findById(productId).orElse(null);

			if (product != null && product.getStock() != null && it.getQuantity() + 1 > product.getStock()) {
				throw new RuntimeException("Cannot increase quantity. Stock limit reached.");
			}

			it.setQuantity(it.getQuantity() + 1);
			repo.save(it);
		}
	}

	public void decrease(Long productId, String username) {
		Optional<CartItem> itOpt = repo.findByUsernameAndProductId(username, productId);
		if (itOpt.isPresent()) {
			CartItem it = itOpt.get();
			if (it.getQuantity() > 1) {
				it.setQuantity(it.getQuantity() - 1);
				repo.save(it);
			} else {
				repo.delete(it);
			}
		}
	}

	public void delete(Long productId, String username) {
		Optional<CartItem> itOpt = repo.findByUsernameAndProductId(username, productId);
		if (itOpt.isPresent()) {
			repo.delete(itOpt.get());
		}
	}

	public void clear(String username) {
		List<CartItem> items = repo.findByUsername(username);
		repo.deleteAll(items);
	}
}
