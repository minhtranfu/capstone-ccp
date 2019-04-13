package utils;

import dtos.Credentials;
import dtos.requests.*;
import dtos.responses.ContractorResponse;
import dtos.responses.DebrisBidResponse;
import dtos.responses.GeneralMaterialTypeResponse;
import entities.*;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.TypeToken;
import org.modelmapper.convention.MatchingStrategies;

import javax.ejb.Singleton;
import java.lang.reflect.Type;
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
				map().setRequesterId(source.getContractor().getId());
				map().setBeginDate(source.getBeginDate());
				map().setEndDate(source.getEndDate());
				map().setRequesterAddress(source.getRequesterAddress());
				map().setRequesterLatitude(source.getRequesterLat());
				map().setRequesterLongitude(source.getRequesterLong());
				map().setEquipmentId(source.getEquipment().getId());
			}
		});

		modelMapper.addMappings(new PropertyMap<HiringTransactionRequest, HiringTransactionEntity>() {
			@Override
			protected void configure() {
				map().getRequester().setId(source.getRequesterId());
				map().getEquipment().setId(source.getEquipmentId());
			}
		});

	}

	public EquipmentEntity toEntity(EquipmentPostRequest equipmentRequest) {
		EquipmentEntity result = modelMapper.map(equipmentRequest, EquipmentEntity.class);
		return result;
	}

	public EquipmentEntity toEntity(EquipmentPutRequest equipmentPutRequest, EquipmentEntity foundEntity) {

		modelMapper.map(equipmentPutRequest, foundEntity);

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


	public ReportEntity toEntity(FeedbackRequest feedbackRequest) {
		return modelMapper.map(feedbackRequest, ReportEntity.class);
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

	public SubscriptionEntity toEntity(SubscriptionRequest subscriptionRequest) {
		return modelMapper.map(subscriptionRequest, SubscriptionEntity.class);
	}

	public void toEntity(SubscriptionRequest subscriptionRequest, SubscriptionEntity managedSubscription) {
		modelMapper.map(subscriptionRequest, managedSubscription);
	}

	public MaterialEntity toEntity(MaterialRequest materialRequest) {
		return modelMapper.map(materialRequest, MaterialEntity.class);
	}
	public void toEntity(MaterialRequest materialRequest, MaterialEntity managedMaterialEntity) {
		 modelMapper.map(materialRequest, managedMaterialEntity);
	}


	public MaterialTransactionEntity toEntity(MaterialTransactionRequest materialTransactionRequest) {
		return modelMapper.map(materialTransactionRequest, MaterialTransactionEntity.class);
		
	}

	public DebrisPostEntity toEntity(DebrisPostRequest debrisPostRequest) {
		return modelMapper.map(debrisPostRequest, DebrisPostEntity.class);
	}
	public DebrisPostEntity toEntity(DebrisPostPostRequest debrisPostPostRequest) {
		return modelMapper.map(debrisPostPostRequest, DebrisPostEntity.class);
	}

	public void toEntity( DebrisPostRequest debrisPostRequest, DebrisPostEntity debrisPostEntity) {
		debrisPostEntity.getDebrisServiceTypes().clear();
		modelMapper.map(debrisPostRequest, debrisPostEntity);

	}

	public DebrisBidEntity toEntity(DebrisBidRequest debrisBidRequest) {
		return modelMapper.map(debrisBidRequest, DebrisBidEntity.class);
	}

	public void toEntity(DebrisBidRequest putRequest, DebrisBidEntity managedDebrisBidEntity) {
		modelMapper.map(putRequest,managedDebrisBidEntity);
	}

	public DebrisBidResponse toResponse(DebrisBidEntity entity) {
		return modelMapper.map(entity, DebrisBidResponse.class);
	}
	public List<DebrisBidResponse> toResponse(List<DebrisBidEntity> entityList) {
		Type listType = new TypeToken<List<DebrisBidResponse>>(){}.getType();
		return modelMapper.map(entityList, listType);
	}

	public DebrisTransactionEntity toEntity(DebrisTransactionRequest debrisTransactionRequest) {
		return modelMapper.map(debrisTransactionRequest, DebrisTransactionEntity.class);
	}

	public DebrisFeedbackEntity toEntity(DebrisFeedbackRequest debrisFeedbackRequest) {
		return modelMapper.map(debrisFeedbackRequest, DebrisFeedbackEntity.class);

	}

	public ContractorResponse toResponse(ContractorEntity foundContractor) {
		return modelMapper.map(foundContractor, ContractorResponse.class);
	}

	public GeneralMaterialTypeResponse toResponse(GeneralMaterialTypeEntity generalMaterialTypeEntity) {
		return modelMapper.map(generalMaterialTypeEntity, GeneralMaterialTypeResponse.class);
	}

	public MaterialFeedbackEntity toEntity(MaterialFeedbackRequest materialFeedbackRequest) {
		return modelMapper.map(materialFeedbackRequest, MaterialFeedbackEntity.class);
	}
}

