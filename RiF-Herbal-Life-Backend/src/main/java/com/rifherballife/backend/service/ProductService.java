package com.rifherballife.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rifherballife.backend.model.Product;
import com.rifherballife.backend.repository.ProductRepository;

@Service
public class ProductService {
	@Autowired
	private ProductRepository productRepository;

	public ProductService(ProductRepository productRepository) {
		this.productRepository = productRepository;
	}

	public List<Product> getAllProducts() {
		return productRepository.findAll();
	}

	public Optional<Product> getProductById(Long productId) {
		return productRepository.findById(productId);
	}

	public Product createProduct(Product product) {
		return productRepository.save(product);
	}

	public Product updateProduct(Long productId, Product updateProduct) {
		return productRepository.findById(productId)
				.map(existing -> {
					existing.setProductName(updateProduct.getProductName());
					existing.setDescription(updateProduct.getDescription());
					existing.setPrice(updateProduct.getPrice());
					existing.setImageURL(updateProduct.getImageURL());
					existing.setStock(updateProduct.getStock());
					return productRepository.save(existing);
				})
				.orElseThrow(() -> new RuntimeException("Product nod found"));
	}

	public void deleteProduct(Long productId) {
		productRepository.deleteById(productId);
	}
}
