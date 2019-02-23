package listeners;

public interface DataChangeSubscriber<T> {
	void onDataChange(T entity);

}
