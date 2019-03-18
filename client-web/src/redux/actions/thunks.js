import { ENTITY_KEY } from '../../common/app-const';
import { loadEntity } from 'redux-entity';
import CcpApiService from '../../services/domain/ccp-api-service';

export const fetchEquipmentTypes = () => {
  return loadEntity(
    ENTITY_KEY.EQUIPMENT_TYPES,
    CcpApiService.getEquipmentTypes()
  );
}

export const fetchEquipmentTypeSpecs = typeId => {
  return loadEntity(
    ENTITY_KEY.EQUIPMENT_TYPE_INFOS,
    CcpApiService.getEquipmentTypeSpecs(typeId)
  );
}

export const fetchFeedbackTypes = () => {
  return loadEntity(
    ENTITY_KEY.FEEDBACK_TYPES,
    CcpApiService.feedbackServices.getFeebackTypes()
  );
}

export const fetchMaterialTypes = () => {
  return loadEntity(
    ENTITY_KEY.MATERIAL_TYPES,
    CcpApiService.materialServices.getMaterialTypes()
  );
}