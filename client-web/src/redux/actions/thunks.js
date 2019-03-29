import { ENTITY_KEY } from '../../common/app-const';
import { loadEntity } from 'redux-entity';
import CcpApiService from '../../services/domain/ccp-api-service';
import { debrisServices, equipmentServices } from 'Services/domain/ccp';

export const fetchEquipmentTypes = () => {
  return loadEntity(
    ENTITY_KEY.EQUIPMENT_TYPES,
    CcpApiService.getEquipmentTypes()
  );
};

export const fetchEquipmentTypeCategories = () => {
  return loadEntity(
    ENTITY_KEY.EQUIPMENT_TYPE_CATEGORIES,
    equipmentServices.getEquipmentTypeCategories()
  );
};

export const fetchEquipmentTypeSpecs = typeId => {
  return loadEntity(
    ENTITY_KEY.EQUIPMENT_TYPE_INFOS,
    CcpApiService.getEquipmentTypeSpecs(typeId)
  );
};

export const fetchFeedbackTypes = () => {
  return loadEntity(
    ENTITY_KEY.FEEDBACK_TYPES,
    CcpApiService.feedbackServices.getFeebackTypes()
  );
};

export const fetchMaterialTypes = () => {
  return loadEntity(
    ENTITY_KEY.MATERIAL_TYPES,
    CcpApiService.materialServices.getMaterialTypes()
  );
};

export const fetchDebrisServiceTypes = () => {
  return loadEntity(
    ENTITY_KEY.DEBRIS_SERVICE_TYPES,
    debrisServices.getDebrisServiceTypes()
  );
};
