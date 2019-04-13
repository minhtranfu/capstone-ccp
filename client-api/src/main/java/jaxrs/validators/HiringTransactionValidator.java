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


	public void validateHiringTransactionRequestBeforeSend(HiringTransactionRequest hiringTransactionRequest) {
		EquipmentEntity foundEquipment = equipmentDAO.findByIdWithValidation(hiringTransactionRequest.getEquipmentId());
		ContractorEntity foundRequester = contractorDAO.findByIdWithValidation(hiringTransactionRequest.getRequesterId());


		//todo validate supplier cannot request his own equipment
		if (foundEquipment.getContractor().getId() == foundRequester.getId()) {
			throw new BadRequestException("You cannot request your own equipment!");
		}

		//validate begindate enddate
		if (hiringTransactionRequest.getBeginDate().isAfter(hiringTransactionRequest.getEndDate())) {
			throw new BadRequestException("beginDate>endDate");
		}

		//  1/30/19 check requester activation
		contractorDAO.validateContractorActivated(foundRequester);

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


}

