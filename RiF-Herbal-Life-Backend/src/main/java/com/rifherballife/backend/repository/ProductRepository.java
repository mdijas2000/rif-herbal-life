package com.rifherballife.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rifherballife.backend.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long>{

}
