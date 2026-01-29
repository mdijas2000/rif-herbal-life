package com.rifherballife.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "cartitems")
public class CartItem {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long cartId;
	private Long productId;
	private Long userId;
	private String username;
	private String productName;
	private double price;
	private int quantity;

	@jakarta.persistence.Lob
	@Column(length = 16777215) // MEDIUMTEXT in MySQL (16MB)
	private String imageURL;

	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public String getImageURL() {
		return imageURL;
	}

	public void setImageURL(String imageURL) {
		this.imageURL = imageURL;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public CartItem() {
		// TODO Auto-generated constructor stub
	}

	@Override
	public String toString() {
		return "CartItem [productId=" + productId + ", productName=" + productName + ", price=" + price + ", quantity="
				+ quantity + ", imageURL=" + imageURL + "]";
	}

}
