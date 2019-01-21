import { ENTITY_KEY } from '../../common/app-const';
import { loadEntity } from 'redux-entity';
import CcpApiService from '../../services/domain/ccp-api-service';

export function fetchEquipmentTypes() {
  return loadEntity(
    ENTITY_KEY.EQUIPMENT_TYPES,
    CcpApiService.getEquipmentTypes()
  );
}

export function fetchEquipmentTypeInfos(typeId) {
  return loadEntity(
    ENTITY_KEY.EQUIPMENT_TYPE_INFOS,
    CcpApiService.getEquipmentTypeInfos(typeId)
  );
}
