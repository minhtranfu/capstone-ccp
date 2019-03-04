package utils;

import dtos.requests.EquipmentPostRequest;
import dtos.requests.EquipmentPutRequest;
import dtos.requests.EquipmentRequest;
import entities.EquipmentEntity;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.convention.MatchingStrategies;

import javax.ejb.Singleton;


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

	public EquipmentEntity toEntity(EquipmentPutRequest equipmentPutRequest) {
		return modelMapper.map(equipmentPutRequest, EquipmentEntity.class);
	}



	public EquipmentPostRequest toRequest(EquipmentEntity equipmentEntity) {
		return modelMapper.map(equipmentEntity, EquipmentPostRequest.class);
	}

}
