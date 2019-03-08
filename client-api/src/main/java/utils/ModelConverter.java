package utils;

import dtos.Credentials;
import dtos.requests.DescriptionImageRequest;
import dtos.requests.EquipmentPostRequest;
import dtos.requests.EquipmentPutRequest;
import dtos.requests.EquipmentRequest;
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



//		foundEntity.setDescriptionImages((Collection<DescriptionImageEntity>) modelMapper.map(equipmentPutRequest.descriptionImages, foundEntity.getDescriptionImages().getClass()));
//		foundEntity.setAvailableTimeRanges((List<AvailableTimeRangeEntity>) modelMapper.map(equipmentPutRequest.availableTimeRanges, foundEntity.getAvailableTimeRanges().getClass()));
//		foundEntity.setAdditionalSpecsValues((List<AdditionalSpecsValueEntity>) modelMapper.map(equipmentPutRequest.additionalSpecsValues, foundEntity.getAdditionalSpecsValues().getClass()));
		return foundEntity;
	}




	public EquipmentPostRequest toRequest(EquipmentEntity equipmentEntity) {
		return modelMapper.map(equipmentEntity, EquipmentPostRequest.class);
	}


}
