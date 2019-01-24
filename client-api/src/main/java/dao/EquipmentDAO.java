package dao;

import entities.Equipment;

import javax.ejb.Singleton;
import javax.enterprise.context.RequestScoped;

@RequestScoped
public class EquipmentDAO extends BaseDAO<Equipment, Long> {

}
