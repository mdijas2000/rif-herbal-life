package com.rifherballife.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rifherballife.backend.model.CartItem;
import com.rifherballife.backend.model.Order;
import com.rifherballife.backend.model.OrderItem;
import com.rifherballife.backend.model.Product;
import com.rifherballife.backend.repository.CartItemRepository;
import com.rifherballife.backend.repository.OrderRepository;
import com.rifherballife.backend.repository.ProductRepository;
import com.rifherballife.backend.repository.UserRepository;
import com.rifherballife.backend.model.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

	private final OrderRepository orderRepository;
	private final CartItemRepository cartItemRepository;
	private final ProductRepository productRepository;
	private final UserRepository userRepository;

	@Transactional
	public Order placeOrder(String username, String deliveryAddress, String deliveryMobileNumber) {
		// Get all cart items for the user
		List<CartItem> cartItems = cartItemRepository.findByUsername(username);

		if (cartItems.isEmpty()) {
			throw new RuntimeException("Cart is empty");
		}

		// Create order
		Order order = Order.builder()
				.username(username)
				.orderDate(LocalDateTime.now())
				.status("PENDING")
				.totalAmount(0.0)
				.deliveryAddress(deliveryAddress)
				.deliveryMobileNumber(deliveryMobileNumber)
				.build();

		double total = 0.0;

		// Create order items from cart items
		for (CartItem cartItem : cartItems) {
			Product product = productRepository.findById(cartItem.getProductId())
					.orElseThrow(() -> new RuntimeException("Product not found: " + cartItem.getProductId()));

			// Check stock availability
			if (product.getStock() != null && product.getStock() < cartItem.getQuantity()) {
				throw new RuntimeException("Insufficient stock for product: " + product.getProductName());
			}

			OrderItem orderItem = OrderItem.builder()
					.order(order)
					.productId(product.getProductId())
					.productName(product.getProductName())
					.quantity(cartItem.getQuantity())
					.price(product.getPrice())
					.build();

			order.getItems().add(orderItem);
			total += product.getPrice() * cartItem.getQuantity();

			// Update stock
			if (product.getStock() != null) {
				product.setStock(product.getStock() - cartItem.getQuantity());
				productRepository.save(product);
			}
		}

		order.setTotalAmount(total);

		// Save order
		Order savedOrder = orderRepository.save(order);

		// Clear cart
		cartItemRepository.deleteAll(cartItems);

		// Update user address and mobile number if provided
		User user = userRepository.findByUsername(username).orElse(null);
		if (user != null) {
			boolean updated = false;
			if (deliveryAddress != null && !deliveryAddress.trim().isEmpty()) {
				user.setAddress(deliveryAddress);
				updated = true;
			}
			if (deliveryMobileNumber != null && !deliveryMobileNumber.trim().isEmpty()) {
				user.setMobileNumber(deliveryMobileNumber);
				updated = true;
			}
			if (updated) {
				userRepository.save(user);
			}
		}

		return savedOrder;
	}

	@Transactional
	public Order cancelOrder(Long orderId, String username) {
		Order order = getOrderById(orderId);

		// Verify order belongs to the user
		if (!order.getUsername().equals(username)) {
			throw new RuntimeException("Access denied: This order does not belong to you");
		}

		// Check if order can be cancelled
		if (!"PENDING".equals(order.getStatus())) {
			throw new RuntimeException("Only PENDING orders can be cancelled. Current status: " + order.getStatus());
		}

		// Update order status
		order.setStatus("CANCELLED");

		// Restore product stock
		for (OrderItem item : order.getItems()) {
			Product product = productRepository.findById(item.getProductId()).orElse(null);
			if (product != null && product.getStock() != null) {
				product.setStock(product.getStock() + item.getQuantity());
				productRepository.save(product);
			}
		}

		return orderRepository.save(order);
	}

	public List<Order> getAllOrders() {
		return orderRepository.findAllByOrderByOrderDateDesc();
	}

	public List<Order> getOrdersByUsername(String username) {
		return orderRepository.findByUsernameOrderByOrderDateDesc(username);
	}

	public Order getOrderById(Long orderId) {
		return orderRepository.findById(orderId)
				.orElseThrow(() -> new RuntimeException("Order not found"));
	}

	public Order updateOrderTracking(Long orderId, String trackingId, String status) {
		Order order = getOrderById(orderId);
		if (trackingId != null && !trackingId.isEmpty()) {
			order.setTrackingId(trackingId);
		}
		if (status != null && !status.isEmpty()) {
			order.setStatus(status);
		}
		return orderRepository.save(order);
	}
}
