package com.rifherballife.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rifherballife.backend.model.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
	Optional<CartItem> findByUserIdAndProductId(Long userId, Long productId);

	CartItem findByProductId(Long productId);

	List<CartItem> findByUsername(String username);

	Optional<CartItem> findByUsernameAndProductId(String username, Long productId);
}
