package com.kimhoanngan.tiemvang.repositories;

import com.kimhoanngan.tiemvang.pojos.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IUserRepository extends JpaRepository<User,String> {

    Optional<User> findByUsername(String username);

    List<User> findByFullNameContaining(String fullName);

    User findByEmail(String email);
}
