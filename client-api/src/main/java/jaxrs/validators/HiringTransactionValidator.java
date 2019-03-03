package jaxrs.validators;


import daos.ContractorDAO;
import daos.EquipmentDAO;
import dtos.requests.HiringTransactionRequest;
import entities.ContractorEntity;
import entities.EquipmentEntity;
import entities.HiringTransactionEntity;

import javax.ejb.Singleton;
import javax.inject.Inject;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.InternalServerErrorException;
import javax.ws.rs.NotFoundException;

@Singleton
public class HiringTransactionValidator {


	@Inject
	EquipmentDAO equipmentDAO;

	@Inject
	ContractorDAO contractorDAO;


	public void validateAddHiringTransaction(HiringTransactionRequest hiringTransactionRequest) {
		//  check equipment id
		EquipmentEntity foundEquipment = validateEquipment(hiringTransactionRequest.getEquipmentId());


		// TODO: 2/17/19 get requester id from cookie
		ContractorEntity foundRequester = validateContractorId(hiringTransactionRequest.getRequesterId());




		//validate begindate enddate
		if (hiringTransactionRequest.getBeginDate().isAfter(hiringTransactionRequest.getEndDate())) {
			throw new BadRequestException("beginDate>endDate");
		}

		//  1/30/19 check requester activation
		if (!foundRequester.isActivated()) {
			throw new BadRequestException("Requester is not activated!");
		}

		//  1/30/19 set equipment location from equipment id

		if (
				foundEquipment.getAddress() == null
						||
						foundEquipment.getAddress().isEmpty()
						||
						foundEquipment.getLongitude() == null
						|| foundEquipment.getLatitude() == null) {
			throw new InternalServerErrorException(String.format("equipment id=%d location data not completed", foundEquipment.getId()));
		}





		// todo  1/30/19 validate equipment is available at that date
		if (!equipmentDAO.validateEquipmentAvailable(
				foundEquipment.getId(),
				hiringTransactionRequest.getBeginDate()
				, hiringTransactionRequest.getEndDate())) {
			throw new BadRequestException("equipment not available on that date!");
		}


	}

	private EquipmentEntity validateEquipment(long id) {
		EquipmentEntity foundEquipment = equipmentDAO.findByID(id);
		if (foundEquipment == null) {
			throw new NotFoundException(String.format("Equipment id=%d not found!", id));
		}
		return foundEquipment;
	}

	private ContractorEntity validateContractorId(long contractorId) {
		ContractorEntity foundContractor = contractorDAO.findByID(contractorId);
		if (foundContractor == null) {
			throw new NotFoundException(String.format("Contractor id=%d not found!", contractorId));
		}
		return foundContractor;
	}

}

