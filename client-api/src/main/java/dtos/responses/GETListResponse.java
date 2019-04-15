package dtos.responses;

import com.google.common.reflect.TypeToken;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.List;

public class GETListResponse<T> {
	private long totalItems;
	private int limit;
	private int offset;
	private String orderBy;
	private List<T> items;



	public GETListResponse() {
	}

	public GETListResponse(int limit, int offset, String orderBy) {
		this();
		this.limit = limit;
		this.offset = offset;
		this.orderBy = orderBy;
	}

	public GETListResponse(long totalItems, int limit, int offset, String orderBy, List<T> items) {
		this();
		this.totalItems = totalItems;
		this.limit = limit;
		this.offset = offset;
		this.orderBy = orderBy;
		this.items = items;
	}

	public long getTotalItems() {
		return totalItems;
	}

	public void setTotalItems(long totalItems) {
		this.totalItems = totalItems;
	}

	public int getLimit() {
		return limit;
	}

	public void setLimit(int limit) {
		this.limit = limit;
	}

	public int getOffset() {
		return offset;
	}

	public void setOffset(int offset) {
		this.offset = offset;
	}

	public String getOrderBy() {
		return orderBy;
	}

	public void setOrderBy(String orderBy) {
		this.orderBy = orderBy;
	}


	public List<T> getItems() {
		return items;
	}

	public void setItems(List<T> items) {
		this.items = items;
	}
}

