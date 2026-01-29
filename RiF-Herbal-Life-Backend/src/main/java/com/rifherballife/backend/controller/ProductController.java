package com.rifherballife.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.rifherballife.backend.model.Product;
import com.rifherballife.backend.service.ProductService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class ProductController {

    @Autowired
	private ProductService productService;

 
	
	@GetMapping
	public List<Product> getAllProducts(){
		return productService.getAllProducts();
	}
	
	@GetMapping("/{productId}")
	public Product getProductById(@PathVariable Long productId) {
		 return productService.getProductById(productId)
				 .orElseThrow(()-> new RuntimeException("Product Not Found"));
		 
	}
	
	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public Product createProduct(@RequestBody Product product) {
		return productService.createProduct(product);
	}
	
	@PutMapping("/{productId}")
	@PreAuthorize("hasRole('ADMIN')")
	public Product updateProduct(@PathVariable Long productId,@RequestBody Product product) {
		return productService.updateProduct(productId, product);
	}
	
	@DeleteMapping("/{productId}")
	@PreAuthorize("hasRole('ADMIN')")
	public void deleteProduct(@PathVariable Long productId) {
		productService.deleteProduct(productId);
	}
}
