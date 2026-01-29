package com.rifherballife.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rifherballife.backend.dto.OrderResponse;
import com.rifherballife.backend.model.Order;
import com.rifherballife.backend.model.User;
import com.rifherballife.backend.repository.UserRepository;
import com.rifherballife.backend.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class OrderController {

	private final OrderService orderService;
	private final UserRepository userRepository;

	@PostMapping
	public ResponseEntity<?> placeOrder(@RequestBody Order orderRequest, Authentication authentication) {
		try {
			String username = authentication.getName();

			// Validate required fields
			if (orderRequest.getDeliveryAddress() == null || orderRequest.getDeliveryAddress().trim().isEmpty()) {
				return ResponseEntity.badRequest().body("Delivery address is required");
			}
			if (orderRequest.getDeliveryMobileNumber() == null
					|| orderRequest.getDeliveryMobileNumber().trim().isEmpty()) {
				return ResponseEntity.badRequest().body("Delivery mobile number is required");
			}

			Order order = orderService.placeOrder(username,
					orderRequest.getDeliveryAddress(),
					orderRequest.getDeliveryMobileNumber());
			return ResponseEntity.ok(order);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PostMapping("/{orderId}/cancel")
	public ResponseEntity<?> cancelOrder(@PathVariable Long orderId, Authentication authentication) {
		try {
			String username = authentication.getName();
			Order order = orderService.cancelOrder(orderId, username);
			return ResponseEntity.ok(order);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<OrderResponse>> getAllOrders() {
		List<Order> orders = orderService.getAllOrders();
		List<OrderResponse> response = orders.stream().map(order -> {
			User user = userRepository.findByUsername(order.getUsername()).orElse(null);
			return OrderResponse.builder()
					.orderId(order.getOrderId())
					.username(order.getUsername())
					.fullName(user != null ? user.getFullName() : null)
					.email(user != null ? user.getEmail() : null)
					.mobileNumber(order.getDeliveryMobileNumber())
					.address(order.getDeliveryAddress())
					.orderDate(order.getOrderDate())
					.items(order.getItems())
					.totalAmount(order.getTotalAmount())
					.status(order.getStatus())
					.trackingId(order.getTrackingId())
					.build();
		}).collect(Collectors.toList());
		return ResponseEntity.ok(response);
	}

	@GetMapping("/my-orders")
	public ResponseEntity<List<Order>> getMyOrders(Authentication authentication) {
		String username = authentication.getName();
		List<Order> orders = orderService.getOrdersByUsername(username);
		return ResponseEntity.ok(orders);
	}

	@GetMapping("/{orderId}")
	public ResponseEntity<?> getOrderById(@PathVariable Long orderId, Authentication authentication) {
		try {
			Order order = orderService.getOrderById(orderId);

			// Check if user is admin or the order belongs to the user
			String username = authentication.getName();
			boolean isAdmin = authentication.getAuthorities().stream()
					.anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

			if (!isAdmin && !order.getUsername().equals(username)) {
				return ResponseEntity.status(403).body("Access denied");
			}

			return ResponseEntity.ok(order);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PostMapping("/{orderId}/tracking")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> updateTracking(@PathVariable Long orderId, @RequestBody Order updateRequest) {
		try {
			Order order = orderService.updateOrderTracking(orderId, updateRequest.getTrackingId(),
					updateRequest.getStatus());
			return ResponseEntity.ok(order);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
}
