package com.kimhoanngan.tiemvang.services.iservices;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface IGeneralService<R, A, U, ID> {
    List<R> findAll();

    Optional<R> findById(ID id);

    R save(A t) throws IOException;

    R update(ID id, U t) throws IOException;

    void delete(ID id);
}
