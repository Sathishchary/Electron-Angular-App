package com.electronapp.authbackend.repository;

import com.electronapp.authbackend.entity.OAuth2Provider;
import com.electronapp.authbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for OAuth2Provider entity
 */
@Repository
public interface OAuth2ProviderRepository extends JpaRepository<OAuth2Provider, Long> {
    Optional<OAuth2Provider> findByProviderNameAndProviderUserId(String providerName, String providerUserId);
    boolean existsByProviderNameAndProviderUserId(String providerName, String providerUserId);
    Optional<OAuth2Provider> findByUserAndProviderName(User user, String providerName);
}