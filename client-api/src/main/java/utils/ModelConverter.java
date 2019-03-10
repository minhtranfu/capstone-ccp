package utils;

import dtos.Credentials;
import dtos.requests.*;
import entities.*;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.convention.MatchingStrategies;

import javax.ejb.Singleton;
import java.util.Collection;
import java.util.List;


@Singleton
public class ModelConverter {

	private ModelMapper modelMapper;

	public ModelConverter() {
		modelMapper = new ModelMapper();
		modelMapper.getConfiguration()
				.setMatchingStrategy(MatchingStrategies.STRICT)
				.setFieldMatchingEnabled(true)
		;

		modelMapper.addMappings(new PropertyMap<CartRequestEntity, HiringTransactionRequest>() {
			@Override
			protected void configure() {
				destination.setRequesterId(source.getContractor().getId());
				destination.setBeginDate(source.getBeginDate());
				destination.setEndDate(source.getEndDate());
				destination.setRequesterAddress(source.getRequesterAddress());
				destination.setRequesterLatitude(source.getRequesterLat());
				destination.setRequesterLongitude(source.getRequesterLong());
				destination.setEquipmentId(source.getEquipment().getId());
			}
		});

	}

	public EquipmentEntity toEntity(EquipmentPostRequest equipmentRequest) {
		EquipmentEntity result = modelMapper.map(equipmentRequest, EquipmentEntity.class);
		return result;
	}

	public EquipmentEntity toEntity(EquipmentPutRequest equipmentPutRequest, EquipmentEntity foundEntity) {

		modelMapper.map(equipmentPutRequest, foundEntity);
		if (equipmentPutRequest.construction == null) {
			foundEntity.setConstruction(null);
		}



//		foundEntity.setEquipmentImages((Collection<DescriptionImageEntity>) modelMapper.map(equipmentPutRequest.equipmentImages, foundEntity.getDescriptionImages().getClass()));
//		foundEntity.setAvailableTimeRanges((List<AvailableTimeRangeEntity>) modelMapper.map(equipmentPutRequest.availableTimeRanges, foundEntity.getAvailableTimeRanges().getClass()));
//		foundEntity.setAdditionalSpecsValues((List<AdditionalSpecsValueEntity>) modelMapper.map(equipmentPutRequest.additionalSpecsValues, foundEntity.getAdditionalSpecsValues().getClass()));
		return foundEntity;
	}





	public EquipmentPostRequest toRequest(EquipmentEntity equipmentEntity) {
		return modelMapper.map(equipmentEntity, EquipmentPostRequest.class);
	}

	public ContractorEntity toEntity(ContractorRequest contractorRequest) {
		return modelMapper.map(contractorRequest,ContractorEntity.class);
	}

	public ContractorEntity toEntity(ContractorRequest contractorRequest, ContractorEntity managedContractor) {
		 modelMapper.map(contractorRequest,managedContractor);
		return managedContractor;
	}


	public ContractorAccountEntity toEntity(Credentials credentials) {
		return modelMapper.map(credentials, ContractorAccountEntity.class);
	}


	public FeedbackEntity toEntity(FeedbackRequest feedbackRequest) {
		return modelMapper.map(feedbackRequest, FeedbackEntity.class);
	}

	public HiringTransactionEntity toEntity(HiringTransactionRequest hiringTransactionRequest) {
		return modelMapper.map(hiringTransactionRequest,HiringTransactionEntity.class);
	}

	public HiringTransactionRequest toRequest(CartRequestEntity cartRequestEntity) {


		return modelMapper.map(cartRequestEntity, HiringTransactionRequest.class);
	}

	public TransactionDateChangeRequestEntity toEntity(TransactionDateChangeRequestRequest transactionDateChangeRequestRequest) {
		return modelMapper.map(transactionDateChangeRequestRequest, TransactionDateChangeRequestEntity.class);
	}

}
