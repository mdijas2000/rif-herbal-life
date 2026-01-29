package com.rifherballife.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.rifherballife.backend.model.OrderItem;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Long orderId;
    private String username;
    private String fullName;
    private String email;
    private String mobileNumber;
    private String address;
    private LocalDateTime orderDate;
    private List<OrderItem> items;
    private Double totalAmount;
    private String status;
    private String trackingId;
}
