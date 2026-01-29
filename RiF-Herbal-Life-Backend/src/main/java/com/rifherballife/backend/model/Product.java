package com.rifherballife.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;

@Entity
@Builder
@Table(name = "products")
public class Product {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long productId;
	private String productName;
	private String description;
	private double price;

	@jakarta.persistence.Lob
	@jakarta.persistence.Column(length = 16777215) // MEDIUMTEXT in MySQL (16MB)
	private String imageURL;
	private String size; // e.g., "250ml", "100g", "500g"
	private Integer stock;

	public Product() {
		super();
	}

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

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public String getImageURL() {
		return imageURL;
	}

	public void setImageURL(String imageURL) {
		this.imageURL = imageURL;
	}

	public Integer getStock() {
		return stock;
	}

	public void setStock(Integer stock) {
		this.stock = stock;
	}

	public String getSize() {
		return size;
	}

	public void setSize(String size) {
		this.size = size;
	}

	public Product(Long productId, String productName, String description, double price, String imageURL) {
		super();
		this.productId = productId;
		this.productName = productName;
		this.description = description;
		this.price = price;
		this.imageURL = imageURL;
		this.size = null;
		this.stock = 0;
	}

	public Product(Long productId, String productName, String description, double price, String imageURL,
			Integer stock) {
		super();
		this.productId = productId;
		this.productName = productName;
		this.description = description;
		this.price = price;
		this.imageURL = imageURL;
		this.size = null;
		this.stock = stock;
	}

	public Product(Long productId, String productName, String description, double price, String imageURL, String size,
			Integer stock) {
		super();
		this.productId = productId;
		this.productName = productName;
		this.description = description;
		this.price = price;
		this.imageURL = imageURL;
		this.size = size;
		this.stock = stock;
	}

	@Override
	public String toString() {
		return "Product [productId=" + productId + ", productName=" + productName + ", description=" + description
				+ ", price=" + price + ", imageURL=" + imageURL + ", size=" + size + ", stock=" + stock + "]";
	}

}
