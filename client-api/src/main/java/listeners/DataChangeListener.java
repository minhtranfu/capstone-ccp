package listeners;

import entities.EquipmentEntity;

import java.util.List;

// TODO: 2/22/19 must be singleton for a publisher pattern !
public interface DataChangeListener<T> {


	void subscribe(DataChangeSubscriber<T> subscriber);

	void unsubscribe(DataChangeSubscriber<T> subscriber);

}
