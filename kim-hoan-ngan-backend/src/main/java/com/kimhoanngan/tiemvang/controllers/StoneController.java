package com.kimhoanngan.tiemvang.controllers;

import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddStoneDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseStoneDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateStoneDTO;
import com.kimhoanngan.tiemvang.services.servicesIMPL.StoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/stones")
public class StoneController {

    @Autowired
    private StoneService stoneService;

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping
    public ResponseEntity<List<ResponseStoneDTO>> getAllStones() {
        List<ResponseStoneDTO> stoneDTOs = stoneService.findAll();
        return ResponseEntity.ok(stoneDTOs);
    }

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping("/{id}")
    public ResponseEntity<Optional<ResponseStoneDTO>> getStoneById(@PathVariable int id) {
        Optional<ResponseStoneDTO> stoneDTO = stoneService.findById(id);
        return stoneDTO.map(category -> new ResponseEntity<>(stoneDTO, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PostMapping
    public ResponseEntity<ResponseStoneDTO> createStone(@RequestBody AddStoneDTO stoneDTO) {
        try {
            ResponseStoneDTO stone = stoneService.save(stoneDTO);
            return new ResponseEntity<>(stone, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<ResponseStoneDTO> updateStone(@PathVariable int id, @RequestBody UpdateStoneDTO stoneDTO) {
        try {
            ResponseStoneDTO updatedStone = stoneService.update(id, stoneDTO);
            return new ResponseEntity<>(updatedStone, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseStoneDTO> deleteStone(@PathVariable int id) {
        try {
            stoneService.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasAnyRole('ROLE_STAFF','ROLE_MANAGER')")
    @GetMapping("get-stones-by-name")
    public ResponseEntity<List<ResponseStoneDTO>> getStonesByName(@RequestParam String name) {
        List<ResponseStoneDTO> stoneDTOs = stoneService.findStonesByName(name);
        return ResponseEntity.ok(stoneDTOs);
    }
}
